# 🔥 Agni-AI

An AI-powered mentor platform that combines a robust backend AI service with a modern frontend interface. Agni is designed to provide personalized guidance with a focus on transforming technical excellence and entrepreneurial thinking.

## 📋 Project Overview

Agni-AI is a full-stack application consisting of:

- **Backend**: A high-performance AI chat service built with Hono and Ollama integration
- **Frontend**: A modern web interface built with Astro for seamless user interaction

The platform leverages local large language models (via Ollama) to provide intelligent, context-aware conversations while maintaining session persistence and tool integration capabilities.

## 🏗️ Architecture

### Backend (`/backend`)

Built with TypeScript using Hono framework, the backend provides:

- **AI Chat Endpoint**: Processes user messages and generates AI responses using Ollama
- **Session Management**: Tracks user conversations with HTTP-only cookies
- **Tool Integration**: Extensible tool system for extending AI capabilities (e.g., joke fetching, file operations)
- **CORS Support**: Full cross-origin resource sharing support
- **System Prompts**: Customizable AI behavior via markdown-based system prompts

**Key Technologies:**
- **Hono**: Lightweight web framework
- **Ollama**: Local LLM integration
- **Express**: Additional HTTP utilities
- **Mongoose**: Database support for future data persistence
- **TypeScript**: Type-safe development

### Frontend (`/frontend`)

Built with Astro, the frontend provides:

- **Modern UI Components**: Reusable Astro components for the user interface
- **Static Site Generation**: Optimized for performance
- **Interactive Chat Interface**: User-friendly conversation interface

**Key Technologies:**
- **Astro 5.x**: Modern web framework
- **TypeScript**: Type-safe frontend development

## 🚀 Getting Started

### Prerequisites

- **Bun**: Fast JavaScript runtime ([install](https://bun.sh))
- **Ollama**: Local LLM service ([install](https://ollama.ai))
- **Node.js** or **npm**: For frontend package management

### Backend Setup

```bash
cd backend
bun install
```

**Environment Setup:**
- Ensure Ollama is running on your local machine
- The backend expects the model `gpt-oss:120b-cloud` to be available in Ollama
- Create or customize `systemprompt.md` to define AI behavior (optional)

**Running the Backend:**

```bash
bun run index.ts
```

The server will start on `http://0.0.0.0:3000`

### Frontend Setup

```bash
cd frontend
npm install
```

**Running the Frontend:**

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` (or the port shown in your terminal)

## 📁 Project Structure

```
Agni-AI/
├── backend/                    # Backend AI service
│   ├── index.ts               # Main server entry point
│   ├── systemprompt.md        # AI behavior configuration
│   ├── package.json           # Backend dependencies
│   └── tools/                 # Extensible tool modules
│       └── fs/               # File system operations
│           ├── glob.ts       # Glob pattern file search
│           ├── readDir.ts    # Directory reading utility
│           └── readFile.ts   # File reading utility
├── frontend/                  # Frontend web interface
│   ├── src/
│   │   ├── components/       # Reusable Astro components
│   │   ├── layouts/          # Page layouts
│   │   └── pages/            # Page components
│   ├── public/               # Static assets
│   ├── astro.config.mjs      # Astro configuration
│   └── package.json          # Frontend dependencies
├── LICENSE
└── README.md
```

## 🔧 API Reference

### Chat Endpoint

**POST** `/chat`

Sends a user message and receives an AI response.

**Request:**
```json
{
  "message": "Your question or statement here"
}
```

**Response:**
```json
{
  "role": "assistant",
  "content": "AI's response here",
  "tool_calls": []
}
```

**Features:**
- Session management via HTTP-only cookies
- Tool calling for extended functionality
- Conversation history tracking per session
- Automatic tool execution and response generation

### Health Check

**GET** `/`

Returns a simple health check response: `"Hello World"`

## 🛠️ Tools System

The backend includes an extensible tool system that allows the AI to execute functions:

### Built-in Tools

- **fetch_joke**: Fetches jokes from `https://icanhazdadjoke.com/`

### File System Tools (`/backend/tools/fs/`)

- **glob.ts**: Search files using glob patterns
- **readDir.ts**: Read directory contents
- **readFile.ts**: Read file contents

Tools are automatically discovered and loaded from the `./tools/` directory.

## 🧠 System Prompt

The AI's personality and behavior are defined in `backend/systemprompt.md`. This file configures:

- Core identity and values
- Communication principles
- Teaching methodologies
- Tone and response styles
- Ethical guidelines

Edit this file to customize the AI's behavior and response patterns.

## 🔐 Security Features

- **CORS Protection**: Configured via Hono CORS middleware
- **Helmet**: Security headers support
- **HTTP-only Cookies**: Session tokens are secure and not accessible via JavaScript
- **HTTPS Ready**: Can be deployed with HTTPS for production

## 📦 Dependencies

### Backend

```json
{
  "cors": "^2.8.5",
  "express": "^5.1.0",
  "fs-extra": "^11.3.2",
  "globby": "^15.0.0",
  "helmet": "^8.1.0",
  "hono": "^4.10.2",
  "moment": "^2.30.1",
  "mongoose": "^8.19.2",
  "ollama": "^0.6.0",
  "uuid": "^13.0.0"
}
```

### Frontend

```json
{
  "astro": "^5.14.8"
}
```

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to any platform supporting Bun or Node.js:

- **Docker**: Create a Dockerfile with Bun runtime
- **Railway**: Deploy directly from GitHub
- **Render**: Supports Bun deployments
- **VPS**: Run on any Linux server with Bun installed

**Important**: Ensure Ollama is accessible to the deployment environment.

### Frontend Deployment

The frontend can be deployed as a static site:

```bash
npm run build
```

Deploy the `dist/` folder to:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3**
- **Any static hosting**

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. Code follows TypeScript best practices
2. System prompts are updated if behavior changes
3. New tools are properly documented
4. Tests are added for new features

## 📄 License

This project is licensed under the terms in the `LICENSE` file.

---

**Agni-AI**: Forging excellence in code, business, and leadership. 🔥