import { cn } from "@/utils/cn";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { Components } from 'react-markdown';

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  model?: string;
  sources?: {
    title: string;
    content: string;
    relevance: number;
  }[];
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ChatMessage({ role, content, model, sources }: ChatMessageProps) {
  const components: Components = {
    pre: ({ node, ...props }) => (
      <div className="relative">
        <pre {...props} className="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto" />
      </div>
    ),
    code: ({ inline, className, children, ...props }: CodeProps) => (
      inline 
        ? <code {...props} className={cn("bg-gray-100 rounded px-1 py-0.5", className)}>{children}</code>
        : <code {...props} className={cn("text-sm", className)}>{children}</code>
    ),
  };

  if (role === "user") {
    return (
      <div className="mb-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-100 rounded-full p-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="font-medium">You</span>
        </div>
        <div className="text-gray-700 pl-8">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
              components={components}
            >
              {content}
            </ReactMarkdown>
            
            {sources && sources.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Sources:</h4>
                {sources.map((source, index) => (
                  <div key={index} className="rounded-md bg-gray-50 p-3">
                    <h5 className="text-sm font-medium text-gray-900">{source.title}</h5>
                    <p className="mt-1 text-sm text-gray-600">{source.content}</p>
                    <p className="mt-1 text-xs text-gray-500">Relevance: {Math.round(source.relevance * 100)}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-lg mb-4",
      model?.includes("gpt-4") ? "bg-purple-50" : "bg-green-50"
    )}>
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          "rounded-full p-2",
          model?.includes("gpt-4") ? "bg-purple-100" : "bg-green-100"
        )}>
          <svg className={cn(
            "w-4 h-4",
            model?.includes("gpt-4") ? "text-purple-600" : "text-green-600"
          )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <span className={cn(
          "font-medium",
          model?.includes("gpt-4") ? "text-purple-700" : "text-green-700"
        )}>
          {model || "Assistant"}
        </span>
      </div>
      <div className={cn(
        "pl-8",
        model?.includes("gpt-4") ? "prose-purple" : "prose-green"
      )}>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
            components={components}
          >
            {content}
          </ReactMarkdown>
          
          {sources && sources.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Sources:</h4>
              {sources.map((source, index) => (
                <div key={index} className="rounded-md bg-gray-50 p-3">
                  <h5 className="text-sm font-medium text-gray-900">{source.title}</h5>
                  <p className="mt-1 text-sm text-gray-600">{source.content}</p>
                  <p className="mt-1 text-xs text-gray-500">Relevance: {Math.round(source.relevance * 100)}%</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
