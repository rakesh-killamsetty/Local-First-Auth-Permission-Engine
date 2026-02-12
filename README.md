# The Local-First Auth & Engine

A small **permission-based system manager** built with **React**, **React Router**, the **Context API**, and **localStorage**.  
It renders a **Resource Dashboard** where what you can see, edit, archive, and delete depends on your current **role**: `Admin`, `Editor`, or `Viewer`.

This project is intentionally focused on **data flow and logic** – there are **no CSS libraries**, only custom CSS written by hand.

---

## Tech Stack

- **Language**: JavaScript (no TypeScript)
- **Bundler / Dev server**: Vite
- **UI library**: React (function components + hooks)
- **Routing**: React Router DOM
- **State management**: React Context API + hooks
- **Persistence**: `localStorage` (with cross-tab sync via `storage` events)

---

## Project Goals

This app is designed to practice:

- **Authentication** and **Authorization** logic
- **Role-based rendering** of resources (`Admin` / `Editor` / `Viewer`)
- **Protected routes** with redirects when not logged in or not authorized
- **Global state** via Context, hydrated from `localStorage`
- **Custom hooks** for filtering by permissions and handling lifecycle sync
- **Immutable updates** to nested state structures

---

## Features

### 1. Login & Roles

- Simple login form (no backend):
  - Enter a **username**
  - Choose a **role**: `Viewer`, `Editor`, or `Admin`
- On login:
  - The user object `{ username, role }` is stored in Context
  - The same object is persisted to `localStorage`
  - The app navigates to the dashboard (`/`)

### 2. Resource Dashboard

Implemented in `DashboardPage.jsx` + `ResourceList.jsx` + `ResourceItem.jsx`.

- Uses a mock **resource list** defined in `src/data/resources.js`
- Each resource has:
  - `id`, `name`, `description`
  - `minRoleRequired` (e.g. `Viewer`, `Editor`, `Admin`)
  - `meta.status` (`active` or `archived`)
- The same `ResourceList` + `ResourceItem` components are reused to display:
  - **Active Resources**
  - **Archived Resources**
- Each resource row shows:
  - Name, minimum role, and current status
  - **Locked badge** if the user role is below `minRoleRequired`
  - Conditional action buttons based on role:
    - `Admin` and `Editor`: can **Archive** / **Restore**
    - `Admin` only: can **Delete**

### 3. Resource Detail Page

Implemented in `ResourceDetailPage.jsx`.

- Route: `/resources/:id`
- Shows resource details if:
  - The resource exists, **and**
  - The current user has a high enough role to access it
- If not allowed, the custom hook plus a safety check either:
  - **Redirects** to `/` (dashboard), or
  - Shows an error message if the redirect has not yet occurred

### 4. Protected Routes

Implemented in `components/ProtectedRoute.jsx`.

- Wraps any route that should only be visible when logged in
- If the app is still restoring the session from `localStorage`, shows a loading message
- If not logged in, uses `useNavigate` to redirect to `/login`

### 5. Global Auth Context & Persistence

Implemented in `auth/AuthContext.jsx`.

- Provides `user`, `initializing`, `login`, and `logout` via `useAuth()`
- On mount:
  - Reads from `localStorage` (key: `local-first-auth-user`)
  - Hydrates the `user` state if valid data is found
- On login:
  - Writes `{ username, role }` into `localStorage`
- On logout:
  - Clears both Context state and the `localStorage` entry
- **Cross-tab sync**:
  - Subscribes to the `window.storage` event
  - If the user logs out or clears storage in another tab, this tab receives the event and immediately logs the user out

---

## Tough Logic Challenges (How They’re Implemented)

### 1. The Persistence Filter

File: `src/hooks/useResourceAccess.js`

- Exports a custom hook `useResourceAccess(allResources)` that:
  - Reads the current user from `useAuth()`
  - Filters `allResources` so only resources with `minRoleRequired` <= `user.role` are included
  - Uses a `roleRank` helper to compare roles in `src/data/resources.js`
- It also uses `useParams` and `useNavigate` to guard direct URL access:
  - If a user manually types an `/resources/:id` URL for a resource they **should not see**, the hook redirects them back to `/` using `navigate('/', { replace: true })`.

### 2. The Lifecycle Sync

File: `src/auth/AuthContext.jsx`

- Listens for `window.addEventListener('storage', handler)`:
  - If the storage key for the user is **removed** (e.g. user logs out or clears storage in another tab), this tab immediately sets `user` to `null`.
  - If the storage value is **updated**, this tab parses the new JSON and updates `user`.
- This keeps all open tabs in sync with the latest auth state, without a backend.

### 3. Complex State Update (Immutable Nested Update)

File: `src/pages/DashboardPage.jsx`

- `resources` is an array of resource objects with nested `meta`
- `updateResourceStatus(id, newStatus)`:
  - Uses `setResources(prev => prev.map(...))`
  - For the matching `id`, returns a **new object**:
    - Spreads the old resource
    - Spreads `resource.meta`
    - Overrides `status` and `lastUpdatedAt`
  - Leaves all other resources unchanged
- This enforces **immutability** even when updating nested objects.

---

## How This Maps to the 3-Day Roadmap

### Day 1 – Foundation, Components, Props

- **Environment Setup**: Vite + React (JavaScript only)
- **Mock JSON Resources**: `src/data/resources.js`
- **Components**:
  - `ResourceList` receives data and title via **props**
  - `ResourceItem` is a reusable row component
- **Conditional Rendering**:
  - Shows "Locked" badge if user role is not high enough
  - Same list components are reused to render both **Active** and **Archived** resources

### Day 2 – State, Hooks, Navigation

- **useState / useEffect**:
  - `DashboardPage` uses `useState` for resources and loading
  - Simulated API delay via `fetchResourcesWithDelay()` + `setTimeout`
- **Authentication Engine**:
  - `LoginPage` manages user input and calls `login()` from Context
  - Logged-in user is stored in Context and drives what is visible
- **Routing**:
  - React Router DOM with:
    - `/login` – public login page
    - `/` – protected dashboard
    - `/resources/:id` – protected detail page
- **Protected Routes**:
  - `ProtectedRoute` checks `user` and sends unauthenticated users to `/login`

### Day 3 – Global State & Persistence

- **Context API**:
  - `AuthProvider` wraps the entire app in `App.jsx`
  - `useAuth()` returns the global `user` and auth actions
- **Local Storage Persistence**:
  - On login, user info is written to `localStorage`
  - On app load, Context rehydrates from `localStorage`
  - `storage` events keep multiple tabs in sync
- **Authorization Checks**:
  - Buttons for `Archive`, `Restore`, `Delete` are wrapped with role checks:
    - Only `Admin` sees **Delete**
    - `Admin` and `Editor` see archive/restore
  - `useResourceAccess` enforces role-based access to resource detail routes.

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open the printed local URL in your browser (typically `http://localhost:5173/`).

### Build for production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## How to Explore the Auth & Permission Logic

1. Start the dev server and open the app.
2. Log in as a **Viewer** and explore what you can see and click:
   - You should see more *Locked* resources
   - Fewer actions (no delete, restricted archive/restore)
3. Log out, then log in as an **Editor**:
   - More resources are visible
   - You can **Archive** and **Restore**, but not **Delete**
4. Log in as an **Admin**:
   - All resources are visible
   - You get full control including **Delete**
5. Open a second tab of the same app:
   - Log out in one tab and watch the other tab react instantly (lifecycle sync)
6. Try typing a URL like `/resources/1` while logged in as a `Viewer`:
   - If the resource requires `Admin`, you’ll be redirected back to `/`

---

## Notes

- The UI is styled entirely with **custom CSS** in `src/style.css`; there are no external CSS frameworks.
- The authentication is **local-only** and for learning/demo purposes – there is no real backend or token validation.
- The codebase is intentionally small and focused so you can easily trace how roles and permissions flow through the app.

