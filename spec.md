# Yaycha Project Specification

## 1. Product Summary

Yaycha is a social-media style frontend built with React, TypeScript, Vite, and Material UI. It supports account creation, session-based authentication, post creation, follow relationships, likes, comments, user search, notifications, and profile browsing.

The application is designed as a lightweight social platform for a backend-driven API environment. Its primary goal is to provide a polished frontend experience for managing social activity without requiring a complex backend implementation in the repo itself.

## 2. Goals

- Let users register and log in securely using a username and password flow.
- Allow signed-in users to create short posts and interact with them.
- Support likes, follows, search, notifications, and profile discovery.
- Maintain responsive, modern UI behavior with Material UI and a shared app shell.
- Use React Query to manage server state and optimistic updates across feeds and profiles.

## 3. Target Audience

- Users who want a minimal social network experience.
- Demo audiences or API integration testing environments.
- Frontend developers validating social app workflows against a backend service.

## 4. Core Features

### 4.1 Authentication

- Register a user with name, username, bio, and password.
- Log in with username and password.
- Persist the JWT token in localStorage.
- Verify the active session through a backend endpoint.
- Store auth state in a shared app context.
- Log out from the app drawer.

### 4.2 Feed

- Display a home feed of posts.
- Switch between Latest and Following views when authenticated.
- Render post metadata such as author, creation time, likes, and comments.
- Show a post composer when the user is logged in.

### 4.3 Posts

- Create a new post with text content.
- Delete a post owned by the current user.
- Use React Query cache updates after mutation events.
- Show success or error notification states.

### 4.4 Comments

- View comments attached to a post.
- Create new comments.
- Delete comments authored by the current user.
- Display relative timestamps and author information.

### 4.5 Likes

- Like and unlike posts and comments.
- Show counts per item.
- Navigate to a dedicated likes page to view users who interacted with a post or comment.

### 4.6 Follow System

- Follow or unfollow other users from search results or profiles.
- Hide or adjust follow actions based on auth state.
- Refresh relevant queries after follow state changes.

### 4.7 Profile

- View profile data such as username, bio, and account details.
- Browse posts associated with a selected user.
- Trigger follow or unfollow actions from the profile page.

### 4.8 Search

- Search users via query input.
- Render matching users with follow controls.
- Keep the search interaction lightweight and responsive.

### 4.9 Notifications

- Fetch notifications for the current user.
- Mark notifications as read.
- Receive live updates via WebSocket and invalidate related queries.

### 4.10 Theme and Layout

- Toggle between dark and light mode.
- Use a global layout with header, drawer navigation, and snackbar notifications.
- Maintain a responsive UI pattern across devices.

## 5. User Flows

### 5.1 Registration

1. User visits the Register screen.
2. User submits name, username, bio, and password.
3. Frontend sends a POST request to the backend users endpoint.
4. The user is redirected to the login page after success.
5. A global confirmation message is displayed.

### 5.2 Login

1. User enters username and password.
2. Frontend requests a session token.
3. Backend returns a JWT and user payload.
4. Token is stored in localStorage.
5. App auth state updates.
6. User is redirected to the home feed.

### 5.3 Create Post

1. Authenticated user opens the new-post form.
2. User enters text and submits the form.
3. Request is sent to the backend.
4. Feed cache refreshes to display the new post.

### 5.4 View Likes

1. User taps the likes count from a post or comment.
2. App navigates to the likes route.
3. The page requests the associated users.
4. Matching user results are shown with follow actions.

### 5.5 Follow User

1. User opens a profile or search result.
2. User clicks Follow or Following.
3. Mutation updates backend state.
4. Related query keys are invalidated and refreshed.

## 6. Route Structure

The app uses a browser router with a shared template shell.

- / -> Home feed
- /login -> Login
- /register -> Register
- /comments/:id -> Post comments
- /profile/:id -> User profile
- /likes/:id/:type -> Like list for a post or comment
- /search -> User search
- /notis -> Notifications

## 7. Architecture

### 7.1 Frontend Stack

- React 19
- TypeScript
- Vite
- Material UI
- React Router DOM
- TanStack React Query
- date-fns
- react-use-websocket

### 7.2 State Management

The app combines several state systems:

- React Context for app-wide auth, theme, notification, and drawer state.
- React Query for server state and cache synchronization.
- LocalStorage for token persistence and theme preference.
- WebSocket updates for real-time invalidation events.

### 7.3 Shared Context

The app context is designed to manage:

- showForm / setShowForm
- mode / setMode
- showDrawer / setShowDrawer
- globalMsg / setGlobalMsg
- auth / setAuth

## 8. API Integration

Backend communication is centralized in [src/lib/fetcher.ts](src/lib/fetcher.ts).

Behavior includes:

- Reading the JWT from localStorage.
- Adding Authorization headers when a token exists.
- Converting failed backend responses into JavaScript Error objects.
- Exposing typed functions for user, post, comment, like, follow, and notification operations.

### Environment Variables

The app expects the following Vite variables:

- VITE_API: Base API URL
- VITE_WS: WebSocket subscription URL

## 9. Data Model

### User

- id
- name
- username
- bio
- follower[]
- following[]
- posts[]
- comments[]

### Post

- id
- content
- created
- user
- postLikes
- comments

### Comment

- id
- content
- created
- postId
- user
- commentLikes

### Like Models

- PostLike: userId, postId, user
- CommentLike: userId, commentId, user

## 10. UI Component Map

Key interface pieces include:

- Header: menu, add-post trigger, search, and theme toggle
- AppDrawer: navigation and auth actions
- Template: global layout with outlet rendering
- Item: social post card
- Comment: comment display and actions
- Form: new post composer
- FollowButton: follow/unfollow interaction
- LikeButton: like toggle and count display
- UserList: user search and likes pages
- Loading: loading indicator

## 11. Current Constraints and Notes

- This project assumes an external backend API exists.
- Some delete operations may not return payload data consistently, which can require cache handling adjustments.
- The app relies heavily on query invalidation and optimistic UI updates.
- Several pages expect backend responses to include user, like, and follow relationship data in a consistent shape.
- Notification events are connected through WebSocket-driven invalidation rather than page-local state alone.
- The project uses browser localStorage for auth persistence, which is suitable for a demo but not ideal for sensitive production authentication flows.

## 12. Non-Functional Requirements

- Responsive UI using Material UI components
- Fast interaction loop through React Query caching
- Clear feedback via snackbars and error alerts
- Light and dark theme support
- Simple and readable information architecture

## 13. Risks / Technical Debt

- API contract dependency on backend naming conventions may break if the server changes.
- Some fetch methods and mutation handlers are not fully consistent in return/await semantics.
- Search, likes, and follow flows may require additional server-side validation and better error handling.
- The app does not include tests or automated QA coverage currently.

## 14. Recommended Next Improvements

- Add unit/integration tests for auth, feed, follow, and like flows.
- Standardize all fetcher return types and mutation logic.
- Improve error handling for expired tokens and unauthorized responses.
- Add protected routes for auth-only pages.
- Improve UX with empty states, loading skeletons, and improved navigation states.
- Replace localStorage-based auth with a more secure session strategy if moved to production.

## 15. Summary

Yaycha is a concise social app built for posting, following, liking, commenting, and user discovery. Its current implementation is a strong frontend prototype with a polished UI and real API integration patterns, making it ready for further feature expansion or backend pairing.
