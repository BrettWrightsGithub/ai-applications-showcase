import { NextResponse } from "next/server";
import OpenAI from "openai";
import crypto from 'crypto';
import { logToFile } from '@/utils/logger';

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Available models and their fallbacks
const MODEL_CONFIG = {
  'gpt-4': {
    fallback: 'gpt-3.5-turbo',
    maxTokens: 4000
  },
  'gpt-3.5-turbo': {
    fallback: null,
    maxTokens: 4000
  }
};

// Helper function to safely stringify objects for logging
function safeStringify(obj: any, space = 2) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, space);
}

export async function POST(request: Request) {
  const requestStart = Date.now();
  const requestId = crypto.randomUUID();
  
  try {
    const { message, messages, models } = await request.json();

    logToFile(`=== Chat Request ${requestId} ===
Timestamp: ${new Date().toISOString()}
Models: ${models.join(', ')}
Message: ${message}
Previous Messages: ${safeStringify(messages)}`);

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!models || !Array.isArray(models) || models.length === 0) {
      return NextResponse.json(
        { error: "At least one model must be specified" },
        { status: 400 }
      );
    }

    // Convert previous messages to OpenAI format if they exist
    const conversationHistory = messages?.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    })) || [];

    // Add the new message to the history
    conversationHistory.push({ role: "user", content: message });

    const responses = await Promise.all(
      models.map(async (model) => {
        const modelStart = Date.now();
        try {
          logToFile(`[${requestId}][${model}] Request:
Tokens: ${conversationHistory.reduce((acc, msg) => acc + msg.content.length, 0)}
Messages: ${safeStringify(conversationHistory)}
Parameters: ${safeStringify({
            model,
            temperature: 0.7,
            max_tokens: MODEL_CONFIG[model as keyof typeof MODEL_CONFIG]?.maxTokens || 4000,
          })}`);

          const completion = await openai.chat.completions.create({
            model,
            messages: conversationHistory,
            temperature: 0.7,
            max_tokens: MODEL_CONFIG[model as keyof typeof MODEL_CONFIG]?.maxTokens || 4000,
          });

          logToFile(`[${requestId}][${model}] Response time: ${Date.now() - modelStart}ms
Response: ${safeStringify(completion)}`);

          return {
            model,
            content: completion.choices[0]?.message?.content || 'No response generated',
          };
        } catch (error: any) {
          logToFile(`[${requestId}][${model}] Error:
Status: ${error.status}
Message: ${error.message}
Type: ${error.type}
Code: ${error.code}`);

          // If the error is due to model access, try fallback
          if (error.status === 404 || error.message?.includes('model not found')) {
            const fallbackModel = MODEL_CONFIG[model as keyof typeof MODEL_CONFIG]?.fallback;
            
            if (fallbackModel) {
              logToFile(`[${requestId}] Falling back to ${fallbackModel} for ${model}`);
              const fallbackCompletion = await openai.chat.completions.create({
                model: fallbackModel,
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: MODEL_CONFIG[fallbackModel as keyof typeof MODEL_CONFIG]?.maxTokens || 4000,
              });

              return {
                model: `${model} (fallback to ${fallbackModel})`,
                content: fallbackCompletion.choices[0]?.message?.content || 'No response generated',
              };
            }
          }

          // If no fallback or other error, return error message
          return {
            model,
            content: `Error: ${error.message || 'Failed to generate response'}`,
          };
        }
      })
    );

    return NextResponse.json({ 
      responses,
      timing: {
        total: Date.now() - requestStart
      }
    });
  } catch (error: any) {
    logToFile(`[${requestId}] Fatal Error:
Name: ${error.name}
Message: ${error.message}
Stack: ${error.stack?.split('\n')[0]}`);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
