# NextFlow

NextFlow is a Krea-inspired AI creative workflow platform for building and running visual DAG pipelines across text, image, and video tasks. It combines Clerk authentication, a node-based editor, asynchronous execution with Trigger.dev, and persistent run tracking with Prisma/PostgreSQL so users can design, execute, and monitor multi-step AI workflows end to end.

---

## Architecture

![NextFlow Architecture](public/architecture.png)

## What This Project Does

- Provides a visual workflow canvas to connect processing nodes as a DAG.
- Supports these node types:
  - Text
  - Upload Image
  - Upload Video
  - LLM
  - Crop Image
  - Extract Frame
- Executes workflows in background jobs using Trigger.dev.
- Persists workflows, run history, and per-node execution results in PostgreSQL via Prisma.
- Authenticates users with Clerk and scopes all workflows/runs to the signed-in user.

## How Execution Works

1. User creates/edits a workflow in the dashboard node editor.
2. Workflow definition (nodes + edges) is saved in the database.
3. User starts execution (full workflow, partial selection, or single node).
4. API creates a `WorkflowRun` record and enqueues `workflow-run-task` on Trigger.dev.
5. Server executor validates DAG, builds topological execution phases, and runs each phase in parallel.
6. Node outputs are routed into downstream node inputs using edge handles.
7. Each node run is stored as a `NodeRun` with status, duration, input/output, and preview/error.
8. Frontend polls run status and updates node UI state and run history.

## AI and Media Processing

- LLM node:
  - Primary provider: Google Gemini (`@google/generative-ai`)
  - Fallback provider: OpenRouter (used when Gemini key is missing or quota is hit)
  - Supports image URL context for multimodal prompts
- Crop Image node:
  - Uses Transloadit assembly steps to import, resize, crop, and export
- Extract Frame node:
  - Uses Transloadit to import video, extract a frame at timestamp/percentage, and export

## API Surface

- `POST /api/execute`:
  - Starts a run for a workflow and enqueues Trigger.dev execution
- `GET /api/workflows`:
  - Lists current user workflows
- `POST /api/workflows`:
  - Creates a new workflow
- `GET /api/workflows/[id]`:
  - Fetches workflow details plus recent runs and node runs
- `PUT /api/workflows/[id]`:
  - Updates workflow name/nodes/edges
- `DELETE /api/workflows/[id]`:
  - Deletes workflow
- `GET /api/runs?workflowId=...`:
  - Lists runs for a workflow
- `GET /api/runs/[id]`:
  - Fetches one run with all node runs
- `POST /api/transloadit/sign`:
  - Returns signed Transloadit params/signature for uploads
- `GET /api/img?i=<url>`:
  - Proxies remote images with caching
- `POST /api/trigger`:
  - Trigger route health endpoint

## Data Model

- `User`:
  - `clerkId`, email/name, relations to workflows and runs
- `Workflow`:
  - owner user, name, serialized `nodes` and `edges`, timestamps
- `WorkflowRun`:
  - workflow/user relation, status, scope, duration, error, start/end time
- `NodeRun`:
  - workflow run relation, node metadata, status, input/output JSON, preview/error, duration

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Full-stack app architecture and type-safe development |
| UI | React 19 | Component-based frontend rendering |
| Styling | Tailwind CSS + Radix UI | Design system, styling, and accessible primitives |
| Workflow Canvas | XYFlow (`@xyflow/react`) | Node-based DAG editor and graph interactions |
| Authentication | Clerk | User auth and session management |
| Database | Prisma + PostgreSQL | Workflow persistence, run history, and node run records |
| Background Jobs | Trigger.dev | Asynchronous workflow execution and orchestration |
| AI Models | Google Gemini + OpenRouter | LLM generation with provider fallback |
| Media Processing | Transloadit | Image/video transformation tasks (crop, frame extraction) |