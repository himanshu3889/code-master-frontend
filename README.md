# Code Master Frontend

This is the browser interface for Code Master. It connects to the Go backend to display your imported problems, provide a code editor for solving them, and surface your submission history, notes, and interview session progress.

It is designed as a single-page application with two primary views: a problem list dashboard and a split-pane problem workspace.

---

## Core Features

### Problem Dashboard

- **Grid and list views**: Browse all imported problems in a responsive layout.
- **Status indicators**: Each problem card shows its current status (Todo, In Progress, Solved, Stuck, etc.) with color coding.
- **Search**: Client-side debounced search combined with server-side fuzzy search when the query is long enough.
- **Filtering**: Filter by status and tags.
- **Pagination**: Page-based pagination with cursor-based alternatives available in the API layer.
- **Quick actions**: Edit status, difficulty, tags, and notes directly from the problem list without opening the workspace.

### Code Workspace

The problem workspace (`/problem/:id`) is a split-pane layout:

- **Left pane**: Problem description, rendered with formatting. Tabs switch between description, submission history, and notes.
- **Right pane**: Monaco Editor with syntax highlighting, IntelliSense, and theme support matching the application theme (dark or light).
- **Language selector**: Dropdown to switch the active language. The editor updates its mode and loads any previously saved code for that language.
- **Run controls**: Buttons to run code against custom input or against the problem's stored test cases.
- **Resizable panels**: The divider between description and editor can be dragged to adjust the ratio. Buttons also exist to collapse either side entirely.
- **Fullscreen mode**: The editor can be expanded to fill the screen, hiding all chrome.

### Live Execution

When you submit code:
- The source code is sent to the backend along with the selected language.
- If test cases exist, they are included in the submission.
- A WebSocket connection streams back the result of each test case as it finishes. The UI shows a running indicator and updates each case row in real time.
- Final results display execution time, memory usage, stdout, stderr, and a per-test-case breakdown.
- If the submission succeeds, the problem status can be updated to Solved automatically or manually.

### Interview Mode

- **Start a session**: From the problem page, start a timed session (default 45 minutes). The backend creates an `interview_session` and returns the remaining time.
- **Live countdown**: A timer in the header counts down. It syncs with the server periodically to avoid drift.
- **Auto-lock on timeout**: If the timer reaches zero, the backend times out the session and optionally auto-submits the current code.
- **Session history**: Submissions and snapshots made during a session are tagged with the session ID. You can review your "interview performance" separately from casual practice in the timeline view.
- **Manual controls**: Complete early, abandon, or trigger timeout manually.

### Submission History

- **Per-problem list**: Every submission is listed with its status badge, language, execution time, and memory.
- **Diff view**: Click a submission to see the source code, stdin, stdout, stderr, and test case results.
- **Timeline / Story**: A chronological feed showing all submissions, code snapshots, and status changes. The "story" view resolves full objects so you see code diffs inline.

### Notes and Metadata

- **Problem notes**: A free-text area attached to each problem. Useful for writing down approach hints, common pitfalls, or revision reminders.
- **Tags**: Auto-detected on import from the problem text. Editable later. Used for filtering and organization.
- **Difficulty override**: The imported difficulty can be changed if you disagree with the platform rating.

---

## Architecture

### Routing

The app uses React Router with `createBrowserRouter`. There are two top-level routes:
- `/` - The Home dashboard with the problem list.
- `/problem/:id` - The problem workspace.

Both routes are independent. The problem page fetches its own data and does not rely on the dashboard's cache.

### State Management

The state is split into two layers:

**Server State (TanStack Query)**
- All data that comes from the backend is fetched through TanStack Query.
- Queries are cached by key. Problems, submissions, snapshots, and languages each have their own query keys.
- Mutations invalidate relevant query keys so the UI refreshes automatically after updates.
- Default options disable refetch on window focus and limit retries to 1 to keep the UI stable.

**Client State (Zustand)**
- A lightweight Zustand store (`store/problemSlice`) holds the current problem list in memory for instant filtering and search without re-fetching.
- UI-specific state like panel sizes, collapsed sections, and active tabs are handled locally with React state or refs, not global stores.

### Styling

The app uses a hybrid approach:
- **Tailwind CSS** handles layout, spacing, typography, and responsive grid behavior.
- **Material UI (MUI)** provides interactive components: dialogs, buttons, menus, tabs, select dropdowns, and the theme system.
- **CSS variables** manage theme-aware colors. The `ThemeWrapper` context provides a dark mode and light mode toggle that updates both Tailwind classes and MUI theme palettes.
- **Framer Motion** adds entrance animations to cards and page transitions.

### Real-time Communication

A `SocketContext` wraps the application and maintains a single WebSocket connection to the backend at `/ws`.
- On submission, the socket listens for per-test-case results.
- A reducer-like state update handles incoming messages: updating the running status, appending results, or marking completion.
- The connection is recreated on re-mount if it drops.

---

## Project Layout

```
src/
├── components/
│   ├── Pages/
│   │   ├── Home/
│   │   │   ├── index.tsx          # Dashboard root: fetches problems, passes to grid
│   │   │   └── HomeNavbar.tsx     # Top navigation and search bar
│   │   ├── Problem/
│   │   │   ├── Index.tsx            # Workspace root: editor, tabs, header, layout
│   │   │   ├── CodeEditor.tsx       # Monaco Editor instance with theme and language switching
│   │   │   ├── ProblemInfo.tsx      # Description rendering and metadata display
│   │   │   ├── ProblemSubmissions.tsx # Submission list and detail view
│   │   │   ├── ProblemNotes.tsx     # Editable notes textarea
│   │   │   ├── ProblemEditorHeader.tsx # Language selector, run buttons, session controls
│   │   │   └── RunTestcasesDialog.tsx # Dialog for running against stored test cases
│   │   └── Problems/
│   │       └── ...                  # Problem card grid and list components
│   ├── UI/
│   │   ├── Layout.tsx               # Common page wrapper
│   │   ├── CustomTabs.tsx           # Tab component used in the workspace
│   │   ├── TabPanel.tsx             # Tab content panel
│   │   └── ...                      # Shared UI primitives
│   └── route.tsx                    # React Router definitions
├── API/
│   └── Index.ts                     # Axios instance with base URL and defaults
├── services/
│   └── codeMasterApi.ts             # All backend API calls: problems, submissions, sessions, timeline
├── store/
│   └── problemSlice/
│       └── problem.ts               # Zustand store for the local problem list
├── hooks/
│   ├── useDebounce.ts               # Debounce hook for search inputs
│   ├── useResizePanel.ts            # Mouse-driven panel resizing logic
│   ├── useShrinkState.ts            # Panel collapse/expand state
│   ├── useFullScreen.ts             # Fullscreen API wrapper for the editor
│   └── useInterviewSession.ts     # Timer sync and session lifecycle hooks
├── context/
│   ├── ThemeWrapper.tsx             # Dark/light mode provider
│   └── SocketContext.tsx            # WebSocket connection provider
├── types/                           # TypeScript interfaces
├── constants/                         # Theme colors, language mappings, status enums
├── utils/                             # Helper functions (grid layouts, formatters)
├── App.tsx                            # Root component: QueryClient, SocketProvider, ThemeWrapper, Router
└── main.tsx                           # Entry point
```

---

## Key Components

### ProblemPage (`/problem/:id`)

This is the most complex component. It coordinates:
1. Fetching the problem, its submissions, snapshots, languages, and any active interview session.
2. Managing the Monaco Editor instance, including language mode switching and theme synchronization.
3. Handling panel resizing through a custom `useResizePanel` hook that listens to mouse events on a draggable divider.
4. Running code: submitting to the backend, listening on the WebSocket for results, and displaying them in a dialog or inline panel.
5. Managing interview session state: starting, syncing the countdown, completing, abandoning, or timing out.

### Home (`/`)

This is the dashboard. It fetches the latest problems on mount, stores them in Zustand, and renders a grid. It supports status filtering and search. The `HomeNavbar` contains the search input and primary navigation.

### ProblemEditorHeader

The sticky header inside the workspace. It contains:
- Problem title and status badge
- Language dropdown
- "Run", "Run Test Cases", and "Submit" buttons
- Interview session timer and controls
- Theme toggle

---

## Running Locally

Requirements: Node.js 18+, npm.

1. Clone the repository and enter the directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

The frontend expects the backend to be running at `http://localhost:27122`. If your backend runs on a different port or host, update the Axios base URL in `src/API/Index.ts`.

### Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint across all TypeScript files
- `npm run format` - Run Prettier on all TypeScript files

---

## Notes

- The Monaco editor bundle is loaded asynchronously to avoid blocking initial render.
- Tailwind and MUI coexist. MUI components handle complex interactions; Tailwind handles layout and spacing. Be careful when overriding MUI styles with Tailwind utilities.
- WebSocket messages are handled through a context rather than TanStack Query because they are push-based events, not request/response.
