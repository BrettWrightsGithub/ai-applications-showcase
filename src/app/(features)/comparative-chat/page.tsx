"use client";

import { useState } from "react";
import { ChatMessage } from "@/components/ui/chat-message";
import { ChatInput } from "@/components/ui/chat-input";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { logError, handleApiError } from "@/utils/error-handler";

interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
}

const MODELS = ["gpt-4", "gpt-3.5-turbo"];

export default function ComparativeChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = { role: "user", content };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Get AI responses
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: content, 
          messages: updatedMessages,
          models: MODELS 
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI responses
      const aiMessages: Message[] = data.responses.map(
        (resp: { model: string; content: string }) => ({
          role: "assistant",
          content: resp.content,
          model: resp.model,
        })
      );

      setMessages((prev) => [...prev, ...aiMessages]);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group messages by conversation turn
  const groupedMessages = messages.reduce((acc: Message[][], message, index) => {
    if (message.role === "user") {
      acc.push([message]);
    } else if (acc.length > 0) {
      acc[acc.length - 1].push(message);
    }
    return acc;
  }, []);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="bg-white/50 rounded-lg p-6 shadow-sm">
          <h1>Compare AI Models</h1>
          <p className="text-gray-600 mt-2">
            See how different AI models respond to the same prompt. This chat compares responses between GPT-4 and GPT-3.5-turbo side by side.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>💡 Try asking complex questions or giving creative tasks to see how the models differ in their approaches.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h2 className="font-semibold text-purple-900">GPT-4</h2>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h2 className="font-semibold text-green-900">GPT-3.5 Turbo</h2>
            </div>
          </div>

          <div className="border-t border-gray-100">
            <div className="max-h-[600px] overflow-y-auto p-6">
              {groupedMessages.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-8">
                  {/* User message spans both columns */}
                  {group[0]?.role === "user" && (
                    <ChatMessage {...group[0]} />
                  )}
                  
                  {/* AI responses in two columns */}
                  <div className="grid grid-cols-2 gap-4">
                    {group.slice(1).map((message, messageIndex) => (
                      <div key={messageIndex} className={message.model?.includes("gpt-4") ? "col-start-1" : "col-start-2"}>
                        <ChatMessage {...message} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  Start a conversation to see the comparison
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 p-6">
            <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
