interface ErrorSolution {
  message: string;
  action?: () => void;
  actionLabel?: string;
}

interface ErrorPattern {
  pattern: RegExp | string;
  getSolution: (error: Error) => ErrorSolution;
}

const ERROR_PATTERNS: ErrorPattern[] = [
  // Network and API Errors
  {
    pattern: /Failed to fetch|NetworkError|ECONNREFUSED/i,
    getSolution: () => ({
      message: 'There seems to be a network connectivity issue. Please check your internet connection.',
      action: () => window.location.reload(),
      actionLabel: 'Retry Connection'
    })
  },
  {
    pattern: /429|too many requests/i,
    getSolution: () => ({
      message: 'Rate limit exceeded. Please wait a moment before trying again.',
      action: () => new Promise(resolve => setTimeout(resolve, 5000)).then(() => window.location.reload()),
      actionLabel: 'Retry in 5 seconds'
    })
  },
  {
    pattern: /401|unauthorized/i,
    getSolution: () => ({
      message: 'Your session has expired. Please log in again.',
      action: () => window.location.href = '/auth/login',
      actionLabel: 'Log In'
    })
  },

  // React and Next.js Specific Errors
  {
    pattern: /Cannot find module|Module not found/i,
    getSolution: (error) => ({
      message: `A required module is missing: ${error.message}. This might be due to a deployment issue or missing dependency.`,
      action: () => window.location.reload(),
      actionLabel: 'Reload Application'
    })
  },
  {
    pattern: /Invalid hook call/i,
    getSolution: () => ({
      message: 'A React hook was called incorrectly. This is likely a development issue.',
      action: () => window.location.reload(),
      actionLabel: 'Reload Page'
    })
  },
  {
    pattern: /Hydration failed/i,
    getSolution: () => ({
      message: 'There was a mismatch between the server and client render. This is usually temporary.',
      action: () => {
        localStorage.clear();
        window.location.reload();
      },
      actionLabel: 'Clear Cache and Reload'
    })
  },

  // Type and Runtime Errors
  {
    pattern: /TypeError/i,
    getSolution: (error) => ({
      message: `A type error occurred: ${error.message}. This might be due to unexpected data format.`,
      action: () => window.location.reload(),
      actionLabel: 'Reload and Try Again'
    })
  },
  {
    pattern: /ReferenceError/i,
    getSolution: (error) => ({
      message: `A reference error occurred: ${error.message}. This might be due to a missing variable or function.`,
      action: () => window.location.reload(),
      actionLabel: 'Reload Page'
    })
  },

  // API Response Errors
  {
    pattern: /api.*failed.*status.*500/i,
    getSolution: () => ({
      message: 'The server encountered an internal error. Our team has been notified.',
      action: () => window.location.reload(),
      actionLabel: 'Try Again'
    })
  },
  {
    pattern: /api.*failed.*status.*404/i,
    getSolution: () => ({
      message: 'The requested resource was not found. This might be due to outdated data.',
      action: () => window.history.back(),
      actionLabel: 'Go Back'
    })
  }
];

export function findErrorSolution(error: Error): ErrorSolution {
  // Log the error for debugging
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });

  // Check if error matches any known patterns
  for (const pattern of ERROR_PATTERNS) {
    if (
      (pattern.pattern instanceof RegExp && pattern.pattern.test(error.message)) ||
      (typeof pattern.pattern === 'string' && error.message.includes(pattern.pattern))
    ) {
      return pattern.getSolution(error);
    }
  }

  // Default solution if no pattern matches
  return {
    message: 'An unexpected error occurred. Our team has been notified.',
    action: () => window.location.reload(),
    actionLabel: 'Reload Page'
  };
}

export function logError(error: Error, context?: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    if (context) console.error('Context:', context);
  }

  // Here you could add integration with error tracking services like Sentry
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   Sentry.captureException(error, { extra: { context } });
  // }

  // You could also send errors to your own API endpoint
  try {
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }).catch(console.error); // Catch and log any errors from the logging endpoint itself
  } catch (e) {
    console.error('Failed to log error:', e);
  }
}

export function handleApiError(error: any) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const statusCode = error.response.status;
    let message = error.response.data?.message || 'An error occurred with the API request';

    // Add more specific messages based on status codes
    switch (statusCode) {
      case 400:
        message = 'Invalid request. Please check your input and try again.';
        break;
      case 401:
        message = 'You need to be logged in to perform this action.';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 429:
        message = 'Too many requests. Please wait a moment and try again.';
        break;
      case 500:
        message = 'Server error. Our team has been notified.';
        break;
    }

    return { message, statusCode };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'No response received from the server. Please check your connection.',
      statusCode: 0
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || 'An error occurred while setting up the request',
      statusCode: 0
    };
  }
}
