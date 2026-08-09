# Yaycha Project Specification

## 1. Overview

Yaycha is a social-media style React application inspired by lightweight microblogging and social networking. Users can register, log in, create posts, like content, comment on posts, follow other users, and browse profile pages and user lists.

The frontend is built with React, TypeScript, Vite, and Material UI. It uses React Router for navigation and React Query for data fetching and mutation state management.

## 2. Product Goals

- Allow users to create a personal account.
- Let authenticated users publish short posts.
- Support quick interaction with posts and comments through likes.
- Enable users to follow and unfollow others.
- Display profile pages with user information and posts.
- Support search for users by username or name.
- Provide a lightweight social feed with latest and following post views.

## 3. Target Users

- General users who want a simple personal social feed.
- Users looking for a minimal social-network experience without complex features.
- Single-user or demo environment audience for frontend testing against a backend API.

## 4. Core Features

### 4.1 Authentication

- Register account with name, username, bio, and password
- Log in with username and password
- Verify user session using a token stored in localStorage
- Store auth state in app-wide context
- Logout from the drawer menu

### 4.2 Feed

- Home page shows a list of posts
- Toggle between “Latest” and “Following” feeds when authenticated
- Display post content, created time, author, likes, and comments
- Show a post form when the user is logged in and the form toggle is enabled

### 4.3 Posts

- Create a new post with text content
- Delete a post only if it belongs to the current authenticated user
- Update cache optimistically using React Query
- Support post removal success and error toast messaging

### 4.4 Comments

- View all comments associated with a post
- Add a new reply comment to a post
- Delete comments authored by the current user
- Show comment metadata such as author name and relative time

### 4.5 Likes

- Like and unlike both posts and comments
- View a list of users who liked a specific post or comment
- Display like counts in the UI

### 4.6 Follow System

- Follow or unfollow another user from profile or search results
- Show follow buttons conditionally based on auth state
- Refresh related query results after follow state changes

### 4.7 Profile

- View a user profile page with username, bio, banner, and avatar area
- Browse a user’s posts from the profile page
- Follow user from the profile page

### 4.8 Search

- Search for users by query term
- Debounced search input to reduce API calls
- Display matching user cards with follow buttons

### 4.9 Theme and Layout

- Dark and light mode toggle in the header
- Global app layout with header, drawer navigation, and snackbar notification
- MUI-based responsive design for consistent UI styling

## 5. User Flows

### 5.1 New User Registration

1. User opens Register page.
2. User enters name, username, bio, and password.
3. Frontend sends POST request to the backend users endpoint.
4. On success, user is redirected to the login page.
5. A global success message is shown.

### 5.2 Login

1. User opens Login page.
2. User enters username and password.
3. Frontend sends authentication request.
4. Backend returns a JWT token and user payload.
5. Token is stored in localStorage.
6. Auth state updates globally.
7. User is redirected to the home feed.

### 5.3 Create Post

1. Logged-in user opens the add-post form using the header button.
2. User enters text and submits the form.
3. Post is sent to the backend.
4. Query cache updates to show the new post at the top of the feed.

### 5.4 View Likes

1. User clicks the likes counter on a post or comment.
2. App navigates to the likes page.
3. The page fetches users who liked that item.
4. User list renders with follow actions.

### 5.5 Follow Another User

1. User opens a profile or search result.
2. User clicks Follow or Following.
3. Mutation updates backend follow state.
4. Related React Query caches are invalidated.

## 6. Route Structure

The app uses a browser router with a shared template wrapper.

- / -> Home
- /login -> Login
- /register -> Register
- /comments/:id -> Comments page for a specific post
- /profile/:id -> User profile
- /likes/:id/:type -> Likes list for a post or comment
- /search -> User search

## 7. Architecture

### 7.1 Frontend Stack

- React 19
- TypeScript
- Vite
- Material UI
- React Router DOM
- TanStack React Query
- date-fns

### 7.2 State Management

The app uses a combination of:

- React Context for app-level data such as auth, theme mode, drawer state, and notifications
- React Query for server state and cache management
- LocalStorage for persistent token and theme preference

### 7.3 Global Context

App context contains:

- showForm
- setShowForm
- mode and setMode
- showDrawer and setShowDrawer
- globalMsg and setGlobalMsg
- auth and setAuth

## 8. API Interaction Layer

The project centralizes backend communication in [src/lib/fetcher.ts](src/lib/fetcher.ts).

Key behaviors:

- Reads token from localStorage
- Adds Authorization header when a token exists
- Converts unsuccessful responses into JavaScript Error objects
- Exposes functions for:
  - users: register, login, verify, fetch user, search
  - posts: list, create, delete, follow-feed
  - comments: create, delete
  - likes: create, delete, fetch liked users
  - follows: follow and unfollow

### Environment Variable

The app expects a Vite environment variable:

- VITE_API

This is used as the base API URL for all backend requests.

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

## 10. UI Component Structure

Key interface components include:

- Header: app header with menu, add-post trigger, search, theme toggle
- AppDrawer: side navigation and auth actions
- Template: global layout shell with snackbar and outlet rendering
- Item: presentation of a post card
- Comment: comment card with like action and delete action
- Form: textarea form for new posts
- FollowButton: follow/unfollow button
- LikeButton: like/unlike button + count display
- UserList: list of users for likes or search result pages
- Loading: loading state indicator

## 11. Current Constraints and Observations

- The project is frontend-focused; the backend API is assumed to exist externally.
- Some API methods do not explicitly return the result of delete operations, which is a potential bug or implementation inconsistency.
- The app relies heavily on optimistic cache updates and invalidation patterns.
- Several screens assume backend responses contain specific fields such as user, likes, and follow relationships.
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
