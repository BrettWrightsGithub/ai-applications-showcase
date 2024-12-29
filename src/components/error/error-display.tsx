'use client';

import { useEffect, useState } from 'react';
import { findErrorSolution } from '@/utils/error-handler';

interface ErrorDisplayProps {
  error: Error | null;
  onDismiss?: () => void;
}

interface ErrorSolution {
  message: string;
  action?: () => void;
  actionLabel?: string;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  const [solution, setSolution] = useState<ErrorSolution | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (error) {
      const errorSolution = findErrorSolution(error);
      setSolution(errorSolution);
      setIsVisible(true);
    }
  }, [error]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!error || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up">
      <div className="relative rounded-lg bg-red-50 p-4 shadow-lg border border-red-200">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 text-red-400 hover:text-red-600"
          aria-label="Dismiss error"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="pr-6">
          <h3 className="text-lg font-semibold text-red-800">An error occurred</h3>
          <p className="mt-2 text-sm text-red-700">{error.message}</p>
          
          {solution && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">{solution.message}</p>
              {solution.action && (
                <button
                  onClick={solution.action}
                  className="mt-2 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  {solution.actionLabel || 'Fix Issue'}
                </button>
              )}
            </div>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-red-600 hover:text-red-800"
          >
            Try reloading the page
          </button>
        </div>
      </div>
    </div>
  );
}
