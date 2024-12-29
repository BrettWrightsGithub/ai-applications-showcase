"use client";

import { useState } from "react";
import { ChatMessage } from "@/components/ui/chat-message";
import { ChatInput } from "@/components/ui/chat-input";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: {
    title: string;
    content: string;
    relevance: number;
  }[];
}

export default function RagDemoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = { role: "user", content };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Get AI response with sources
      const response = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: content,
          messages: updatedMessages
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response with sources
      setMessages(messages => [...messages, {
        role: "assistant",
        content: data.response,
        sources: data.sources
      }]);

    } catch (error) {
      console.error("Failed to get response:", error);
      // Add error message
      setMessages(messages => [...messages, {
        role: "assistant",
        content: "I apologize, but I encountered an error while processing your request. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-sm mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            RAG Demo
          </h1>
          <p className="mt-2 text-gray-600">
            Experience how Retrieval-Augmented Generation (RAG) enhances AI responses with relevant information from a knowledge base.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>💡 Ask questions about specific topics to see how the AI retrieves and uses information from the knowledge base.</p>
          </div>
        </div>

        {/* Chat section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="max-h-[600px] overflow-y-auto p-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                sources={message.sources}
              />
            ))}
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start by asking a question!
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-4">
            <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
