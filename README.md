# Yaycha

Yaycha is a React + TypeScript social app inspired by lightweight microblogging. It includes user authentication, creating and viewing posts, comments, likes, follow relationships, notifications, search, and profile pages.

## Overview

This frontend is built with Vite, React 19, TypeScript, Material UI, React Router, TanStack Query, and a lightweight WebSocket notification layer. The app expects a backend API to provide the social data layer and is designed to work with a JWT-based auth flow.

## Features

- User registration and login
- JWT token persistence in localStorage
- Home feed with latest and following views
- Create, view, and delete posts
- Add and remove comments
- Like and unlike posts/comments
- Follow and unfollow users
- Search users by name or username
- Profile pages with user bio and content
- Notification center and real-time invalidation updates via WebSocket
- Dark/light theme toggle
- Responsive MUI-based layout

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- React Router DOM
- TanStack React Query
- date-fns
- react-use-websocket

## Project Structure

- src/pages: route-level screens
- src/components: reusable UI pieces
- src/lib/fetcher.ts: shared API wrapper
- src/routes/routes.tsx: route configuration
- src/types: shared TypeScript models
- src/ThemedApp.tsx: app-level context and state
- src/AppSocket.tsx: WebSocket event handling

## Environment Variables

Create a .env file in the project root and add:

```bash
VITE_API=http://localhost:3000
VITE_WS=ws://localhost:8000/subscribe
```

The frontend uses VITE_API as the base URL for all API requests and VITE_WS for the notification subscription.

## Getting Started

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Notes

- This project is frontend-focused and relies on an external backend API.
- Authenticated requests attach the JWT in the Authorization header.
- Notifications and cache invalidation are tied to the WebSocket event stream.
- The app uses React Query for optimistic updates and query invalidation after mutations.

## Main Routes

- / -> Home feed
- /login -> Login page
- /register -> Register page
- /comments/:id -> Comments for a post
- /profile/:id -> User profile
- /likes/:id/:type -> Like list for post or comment
- /search -> User search
- /notis -> Notifications

## Related Spec

See [spec.md](spec.md) for a more detailed product specification and functional requirements.
