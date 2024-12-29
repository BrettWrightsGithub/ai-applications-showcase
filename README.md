# AI Applications Showcase

A comprehensive web-based portfolio demonstrating various practical AI use cases. This project showcases technical expertise in AI development through interactive interfaces that allow users to explore and test different AI functionalities.

## Features

1. **Comparative Chat Interface**
   - Compare responses between GPT-4 and GPT-3.5-turbo side by side
   - Interactive chat interface with real-time responses
   - Automatic model fallback handling

2. **RAG Demonstration**
   - Ask questions and receive responses augmented with relevant information
   - View source documents and their relevance scores
   - Transparent AI reasoning with cited sources

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API
- **UI Components**: Custom components with Tailwind

## Prerequisites

- Node.js (>= 18.17.0)
- npm or Yarn
- OpenAI API Key

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-applications-showcase.git
   cd ai-applications-showcase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── (features)/
│   │   │   ├── comparative-chat/  # Side-by-side model comparison
│   │   │   └── rag-demo/          # RAG implementation
│   │   ├── api/
│   │   │   ├── chat/             # Comparative chat endpoint
│   │   │   └── rag/              # RAG endpoint
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/                   # Shared UI components
│   └── utils/                    # Utility functions
├── public/
├── .env.local                    # Environment variables
└── README.md
```

## Development

- **Logging**: All API requests and responses are logged to `/logs/api.log`
- **Error Handling**: Comprehensive error handling with fallback mechanisms
- **TypeScript**: Full type safety across the application
- **Code Organization**: Feature-based directory structure
- **API Design**: RESTful endpoints with proper error responses

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
