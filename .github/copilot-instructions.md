<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Chat Application - Copilot Instructions

This is a Next.js chat application built with TypeScript and Tailwind CSS. The application features both frontend and backend functionality within a single Next.js project.

## Project Structure

- **Frontend**: React components in `src/components/` and pages in `src/app/`
- **Backend**: API routes in `src/app/api/` for handling messages and users
- **Types**: TypeScript interfaces in `src/types/`
- **Utils**: Helper functions in `src/utils/`

## Key Technologies

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React hooks for state management
- API routes for backend functionality

## Code Style Guidelines

- Use functional components with TypeScript
- Implement proper error handling in API routes
- Use Tailwind CSS for all styling
- Follow React best practices for hooks and state management
- Maintain type safety throughout the application

## API Structure

- `GET /api/messages` - Fetch all messages
- `POST /api/messages` - Send a new message
- `GET /api/users` - Fetch online users

## Component Guidelines

- Keep components small and focused
- Use proper TypeScript interfaces for props
- Implement responsive design with Tailwind CSS
- Handle loading and error states appropriately
