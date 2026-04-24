# ASEANWebTech_Task3
Frontend Task

Technical Specification

Simple React Web App for Travel Map API

1) Purpose

Build a simple, production-ready React frontend that integrates with the existing API (`https://demomost.ru/api/documentation`) for travelers to:

- create an account and log in,

- publish location-based posts (`message`, `latitude`, `longitude`),

- browse a global feed,

- comment on posts,

- like/dislike posts.

The app should be intentionally lightweight, easy to maintain, and suitable as an MVP client for web users.

2) Product Goals

- Provide a clear and fast user flow from authentication to content interaction.

- Make API-driven functionality fully usable without requiring backend changes.

- Keep UI simple and responsive for desktop and mobile browsers.

- Ensure reliable handling of loading, validation, and API errors.

3) Scope

In scope:

- Authentication: register, login, logout, current user profile (`me`).

- Global feed of posts.

- Create a post with text + coordinates.

- View post details.

- Add and delete own comment.

- Like/dislike (set or remove own reaction).

- Basic map point display for post location (simple marker-based view).

4) Target Users

- Travelers who want to share short location-based impressions.

- Logged-in users only for feed interactions and content operations.

5) Suggested Tech Stack

- React 18+ with JavaScript.

- Vite.

- Map: Leaflet or Google Maps (Leaflet preferred for simplicity and no key requirement in MVP).

6) Functional Requirements

FR-1 Authentication

- User can register with `name`, `email`, `password`, `password_confirmation`.

- User can log in with `email`, `password`.

- Access token from API is stored securely on client side.

- Authenticated user can fetch current profile (`me`).

- User can log out and token is removed locally.

- Unauthorized requests redirect to login.

FR-2 Global Feed

- Authenticated user can open feed page and see posts on the map.

- Feed shows: message on coordinates, author, created date, comments count, likes/dislikes count, current user reaction.

FR-3 Create Post

- User can create post with required fields:

  - `message` (required, max 1000),

  - `latitude` (required, -90..90),

  - `longitude` (required, -180..180).

- On success, new post creates.

FR-4 Post Details

- User can open a post details page.

- Details show full post info, comments list, and reaction state.

- User can delete own post only.

FR-5 Comments

- User can fetch comments for a post (paginated if backend returns pagination).

- User can add comment (`message`, required, max 500).

- User can delete only own comment.

- Comment list updates after add/delete.

FR-6 Reactions

- User can set reaction to `like` or `dislike`.

- User can remove own reaction.

- Counts and current reaction state update after action.

FR-7 Map View

- App provides a “Map” page displaying posts using post coordinates.

- Create new posts.

- Clicking marker opens post details.

7) API Integration Contract

Base URL: `https://demomost.ru/api/v1`

Auth endpoints:

- `POST /auth/register`

- `POST /auth/login`

- `POST /auth/logout`

- `GET /auth/me`

Post endpoints:

- `GET /posts`

- `POST /posts`

- `GET /posts/{post}`

- `DELETE /posts/{post}`

Comment endpoints:

- `GET /posts/{post}/comments`

- `POST /posts/{post}/comments`

- `DELETE /comments/{comment}`

Reaction endpoints:

- `PUT /posts/{post}/reaction`

- `DELETE /posts/{post}/reaction`

Swagger references (backend):

- UI route: `/api/documentation`

- JSON docs route: `/docs`

8) UI/UX Requirements

- Clean, minimal layout.

- Mobile-first responsive design.

- Clear validation messages near fields.

- Standardized loading states (skeleton/spinner).

- Standardized empty states (“No posts yet”, “No comments yet”).

- Standardized error toasts/banners.

- Destructive actions (delete post/comment) require confirmation.

9) Error Handling Requirements

- `401`: redirect to login (or show session expired message).

- `403`: show “Action not allowed”.

- `404`: show not found page/resource message.

- `422`: render field-level validation messages from API payload.

- `429`: show retry message for throttled login.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
"# ASEANWebTech_Task3" 
"# ASEANWebTech_Task3" 
