import { NextResponse } from "next/server";
import OpenAI from "openai";
import { logToFile } from "@/utils/logger";

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mock knowledge base for demo
// In a real application, this would be replaced with a proper vector database
const KNOWLEDGE_BASE = [
  {
    title: "RAG Overview",
    content: "Retrieval-Augmented Generation (RAG) is a technique that enhances Large Language Models by providing them with relevant external knowledge during inference. This allows the model to generate more accurate and contextual responses.",
    embeddings: [] // In a real app, we would store pre-computed embeddings
  },
  {
    title: "RAG Benefits",
    content: "RAG systems offer several advantages: 1) Improved accuracy with up-to-date information, 2) Reduced hallucination by grounding responses in source documents, 3) Ability to cite sources for transparency.",
    embeddings: []
  },
  {
    title: "RAG Architecture",
    content: "A typical RAG system consists of three main components: 1) A retriever that finds relevant documents, 2) A generator (usually an LLM) that produces responses, and 3) A knowledge base storing documents and their embeddings.",
    embeddings: []
  }
];

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const requestStart = Date.now();

  try {
    const { message, messages } = await request.json();

    logToFile(`[${requestId}] RAG Request:
Message: ${message}
Previous Messages: ${JSON.stringify(messages)}`);

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // In a real application, we would:
    // 1. Generate embeddings for the query
    // 2. Find similar documents using vector similarity
    // 3. Retrieve relevant documents
    
    // For demo, we'll just return all documents with mock relevance scores
    const sources = KNOWLEDGE_BASE.map(doc => ({
      title: doc.title,
      content: doc.content,
      relevance: Math.random() * 0.5 + 0.5 // Mock relevance score between 0.5 and 1.0
    })).sort((a, b) => b.relevance - a.relevance);

    // Prepare context for the LLM
    const context = sources
      .map(doc => `${doc.title}:\n${doc.content}`)
      .join('\n\n');

    const systemPrompt = `You are a helpful AI assistant with access to a knowledge base.
Base your response on the following context, but express it naturally in your own words.
If the context doesn't contain relevant information, you can draw from your general knowledge.

Context:
${context}

Remember to be clear and concise in your response.`;

    // Get completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';

    logToFile(`[${requestId}] RAG Response:
Response: ${response}
Sources: ${JSON.stringify(sources)}
Time: ${Date.now() - requestStart}ms`);

    return NextResponse.json({ 
      response,
      sources: sources.slice(0, 2) // Only return top 2 most relevant sources
    });
  } catch (error: any) {
    logToFile(`[${requestId}] RAG Error:
Error: ${error.message}
Stack: ${error.stack?.split('\n')[0]}`);

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
