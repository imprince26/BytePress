# BytePress

BytePress is a privacy-focused file tools app for quick, everyday work with images and PDFs. It is designed to keep the workflow simple: choose a tool, upload or drop a file, adjust a few settings, and download the result.

The current product centers on fast client-first experiences where practical, with a hybrid processing model for workflows that eventually need server-side support.

## What BytePress Does

BytePress currently provides a focused set of tools for common file tasks:

- Compress images by quality settings or target size.
- Resize images by exact dimensions or proportional scaling.
- Convert images between supported formats.
- Merge PDFs into a single document.
- Split PDFs into smaller documents.
- Rotate PDF pages to fix orientation issues.
- Convert images into PDF output.

The app also includes authentication, a user dashboard, settings, usage tracking, and recent job history for a smoother repeat-workflow experience.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Drizzle ORM
- Neon PostgreSQL
- Better Auth
- pdf-lib
- Resend
- Phosphor Icons

## Key Routes

- `/` - Marketing homepage and entry point.
- `/tools` - Tool directory.
- `/tools/image-compress` - Image compression workspace.
- `/tools/image-resize` - Image resizing workspace.
- `/tools/image-convert` - Image conversion workspace.
- `/tools/images-to-pdf` - Image to PDF workspace.
- `/tools/pdf-merge` - PDF merge workspace.
- `/tools/pdf-split` - PDF split workspace.
- `/tools/pdf-rotate` - PDF rotation workspace.
- `/dashboard` - User dashboard.
- `/settings` - Account and preferences.
- `/login` - Sign-in flow.
- `/forgot-password` - Password reset request.
- `/reset-password` - Password reset completion.

## Database Model

The project uses Drizzle ORM with a PostgreSQL schema that includes:

- `user`
- `session`
- `account`
- `verification`
- `usage_event`
- `file_job`
- `tool_limit`

These tables support authentication, usage tracking, queued file jobs, and per-tool limit controls.

## Architecture Overview

### Frontend

The UI is built with the Next.js App Router and shadcn/ui components. The design language is intentionally clean and light, with a strong focus on readability, fast task completion, and clear file handling states.

### File Processing

BytePress is structured around a hybrid processing model:

- Browser-side processing is preferred when it is practical and safe.
- Server-side processing is reserved for workflows that need heavier conversion or job management.
- Temporary files are expected to be cleaned up automatically after processing.

### Usage and Limits

Usage tracking is built around daily limits for anonymous and signed-in users. The current codebase includes anonymous usage helpers, recent job storage, and the groundwork for job history and quotas.

## Project Structure

```text
src/
	app/              App Router pages and API routes
	components/       Shared UI and layout components
	db/               Drizzle schema and database entry points
	lib/              Auth, file, image, PDF, and usage utilities
```

## Privacy Notes

BytePress is intended to be a privacy-conscious file utility. The product direction emphasizes minimal retention, temporary processing, and limiting stored metadata to what is needed for functionality, quotas, and basic diagnostics.