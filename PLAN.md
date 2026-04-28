# BytePress Project Plan

## Vision

BytePress is a privacy-focused file tools website for personal and trusted-friend use. The product should make common image, PDF, and document conversions fast, beautiful, and safe without forcing users to upload sensitive files to unknown third-party websites.

Core promise: files are processed privately, stored only when required for processing, and automatically deleted after completion.

## Current Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Phosphor Icons
- NeonDB PostgreSQL
- Drizzle ORM

## Product Scope

### Image Tools

- Compress image by quality percentage.
- Compress image by target file size, for example compress a 2 MB image to 500 KB.
- Resize image by width, height, percentage, or preset dimensions.
- Convert image formats between JPG, PNG, WEBP, and AVIF where supported.
- Show before/after file size, dimensions, and estimated savings.
- Download processed image immediately.

### PDF Tools

- Merge multiple PDFs.
- Split PDF by page range or individual pages.
- Compress PDF.
- Convert PDF to Word.
- Convert Word to PDF.
- Show processing status, output size, and download action.

### Access Model

- Anonymous users can use a limited number of tasks.
- Login is required after the anonymous limit is reached.
- Logged-in users get higher limits.
- Admin/trusted users can receive custom limits.

## Privacy Principles

- Prefer browser-side processing whenever practical.
- Upload files to the server only when the tool requires server-side processing.
- Do not sell, inspect, train on, or reuse user files.
- Delete temporary files automatically after processing.
- Store only minimal metadata needed for limits, diagnostics, and user experience.
- Make file history optional or metadata-only by default.

## Recommended Architecture

### Frontend

- Next.js App Router pages for landing, tools, auth, dashboard, settings, and privacy.
- Shared upload component with drag-and-drop, file validation, progress state, and result summary.
- Light-first visual system using shadcn/ui components, soft gradients, strong whitespace, and clear privacy messaging.

### Database

- NeonDB PostgreSQL.
- Drizzle ORM schema and migrations.
- Tables planned:
  - `users`
  - `sessions`
  - `accounts`
  - `usage_events`
  - `file_jobs`
  - `tool_limits`

### Auth

- Recommended: Better Auth with Drizzle adapter.
- Alternative: Auth.js if preferred.
- Login options to decide:
  - Email and password.
  - Magic link.
  - Google login.

### Processing

- Images: browser-first using Canvas/Web APIs where possible, with server fallback later if needed.
- PDF merge/split: browser-first or server-side with `pdf-lib` depending file size and UX.
- PDF compression: server-side worker, likely Docker-based.
- Word to PDF and PDF to Word: server-side worker using LibreOffice or another open-source conversion pipeline.

### Deployment

- Recommended for full feature set: Railway, Fly.io, or another Docker-capable host.
- Alternative: Vercel frontend plus separate Docker worker for heavy conversion jobs.
- NeonDB used as hosted PostgreSQL.

## Phase 1: Foundation

- Create project plan and environment variable template.
- Replace starter homepage with polished privacy-focused landing page.
- Update app metadata and basic theme tokens.
- Add initial tool categories and feature cards.
- Establish visual direction for light-based UI.
- Prepare project for auth, database, and usage limits.

## Phase 2: Database And Auth

- Install and configure Drizzle ORM.
- Add NeonDB connection.
- Add initial database schema.
- Add auth library after final decision.
- Add login, register, and session-aware UI.
- Add anonymous usage tracking with cookie/device token.
- Add logged-in usage tracking by user ID.

## Phase 3: Image Tools

- Build reusable file upload/dropzone UI.
- Implement image compression by quality.
- Implement image compression by target size.
- Implement image resizing.
- Implement image format conversion.
- Add client-side result preview and download.
- Track usage events.

## Phase 4: PDF Basic Tools

- Implement PDF merge.
- Implement PDF split.
- Add page range selector.
- Add PDF result summary and download.
- Track usage events.

## Phase 5: Server Processing Worker

- Add temporary file storage path or object storage abstraction.
- Add job model and processing states.
- Add PDF compression pipeline.
- Add Word to PDF pipeline.
- Add PDF to Word pipeline.
- Add automatic cleanup for temporary files.
- Add file size limits and abuse protection.

## Phase 6: Dashboard And Settings

- Add dashboard with usage quota, recent jobs, and privacy status.
- Add settings page for account, privacy preferences, and file history preference.
- Add admin-only limit controls for trusted users.
- Add improved empty states and error states.

## Phase 7: Quality And Polish

- Add unit tests for core utilities.
- Add integration tests for API routes.
- Add upload validation tests.
- Improve mobile layouts.
- Improve accessibility and keyboard navigation.
- Add production logging without storing sensitive file content.

## Future Improvements

- Batch image compression.
- Batch image conversion.
- HEIC to JPG conversion.
- SVG optimization.
- Watermark removal is intentionally excluded unless the user owns the content.
- Add watermarking tool for user-owned PDFs/images.
- OCR PDF to searchable PDF.
- PDF rotate pages.
- PDF reorder pages visually.
- PDF password protect and unlock for user-owned files.
- PDF metadata editor.
- PDF page numbering.
- PDF to images.
- Images to PDF.
- ZIP output for batch jobs.
- Local desktop app using Tauri for maximum privacy.
- Self-host mode with local-only processing.
- Team/shared trusted-friends workspace.
- Admin analytics with privacy-preserving aggregate usage only.
- Optional end-to-end encrypted temporary storage for large jobs.

## Open Decisions

- Auth library: Better Auth, Auth.js, or Clerk.
- Login methods: email/password, magic link, Google, or a combination.
- Deployment target: Docker host, Vercel plus worker, or local/self-hosted.
- Anonymous usage limit: recommended 5 tasks per day.
- Logged-in free usage limit: recommended 25 tasks per day.
- File history: no history, metadata-only, or user-controlled optional history.
- Maximum upload size for anonymous and logged-in users.

## Immediate Next Steps

- Complete Phase 1 UI foundation.
- Decide auth and deployment choices.
- Add Drizzle and NeonDB setup.
- Add usage limit schema and middleware.
- Start image compression tool as the first functional tool.
