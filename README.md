# Chat Application

A modern, real-time chat application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 💬 Real-time messaging interface
- 👥 Online users display
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 TypeScript for type safety
- 🚀 Built on Next.js 15 with App Router
- 📱 Mobile-friendly design

## Project Structure

```
chat-application/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── messages/
│   │   │   │   └── route.ts      # Messages API endpoint
│   │   │   └── users/
│   │   │       └── route.ts      # Users API endpoint
│   │   ├── globals.css           # Global styles with Tailwind
│   │   ├── layout.tsx            # Root layout component
│   │   └── page.tsx              # Main chat page
│   ├── components/
│   │   ├── ChatMessage.tsx       # Individual message component
│   │   ├── MessageInput.tsx      # Message input form
│   │   └── UsersList.tsx         # Online users sidebar
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── utils/
│       └── helpers.ts            # Utility functions
├── .github/
│   └── copilot-instructions.md   # GitHub Copilot instructions
└── package.json
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management and side effects
- **API Routes** - Backend functionality

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chat-application
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Messages API (`/api/messages`)

- **GET** `/api/messages` - Fetch all messages
- **POST** `/api/messages` - Send a new message

### Users API (`/api/users`)

- **GET** `/api/users` - Fetch online users

## Development

### Code Style

- Use functional components with TypeScript
- Implement proper error handling in API routes
- Use Tailwind CSS for all styling
- Follow React best practices for hooks and state management
- Maintain type safety throughout the application

### Component Guidelines

- Keep components small and focused
- Use proper TypeScript interfaces for props
- Implement responsive design with Tailwind CSS
- Handle loading and error states appropriately

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
