# Repository Guidelines

## Project Structure & Module Organization
- The Next.js 15 App Router lives in `src/app`, with route groups like `(auth)` and `(dashboard)` plus API handlers in `src/app/api`.
- Shared React primitives and Shadcn-inspired widgets reside in `src/components/ui`, while higher-level layouts sit alongside them (for example `src/components/app-sidebar.tsx`).
- Feature code such as authentication flows is grouped inside `src/features`, and reusable logic is centralized under `src/hooks` and `src/lib`.
- The tRPC layer (`src/trpc`) wires client and server helpers, and long-running or scheduled jobs live in `src/inngest`.
- Database schema lives in `prisma/schema.prisma`; running Prisma generates the client into `src/generated/prisma`. Static assets belong in `public/`.

## Build, Test, and Development Commands
- `npm run dev` — start the local development server on port 3000.
- `npm run build` — create an optimized production build (runs type checks by default).
- `npm run start` — serve the production build locally; run `npm run build` first.
- `npx prisma generate` — regenerate the typed Prisma client after schema edits; pair with `npx prisma migrate dev --name <change>` when evolving the database.

## Coding Style & Naming Conventions
- Write modern TypeScript React components with functional patterns; prefer server components unless client hooks (React Query, forms, etc.) are required.
- Keep files kebab-cased (`app-sidebar.tsx`, `use-mobile.ts`); export a named component per file and colocate supporting helpers.
- Tailwind CSS v4 backs styling via `globals.css`; favor utility-first classes with shared variants built via `class-variance-authority`.
- Run Prettier-equivalent formatting in your editor (2-space indentation) and ensure imports stay sorted logically (framework → internal modules).

## Testing Guidelines
- Add component smoke tests with React Testing Library colocated as `*.test.tsx` next to the unit under test; mirror feature folders when possible.
- Exercise data workflows (tRPC procedures, Inngest functions) with integration tests that seed Prisma against a disposable database.
- Target meaningful coverage on new code paths and document any gaps directly in the PR description when exceptions are unavoidable.

## Commit & Pull Request Guidelines
- Follow the existing short, lowercase style (`update: add ai providers`); start with an action verb and keep the scope focused.
- Each PR should include: a concise summary, linked issue or task id, test evidence (`npm run build` or screenshots for UI changes), and any database migration notes.
- Request review from a domain owner (feature lead, platform lead) and confirm environments updated (`DATABASE_URL`, AI provider keys, Inngest credentials) before merging.

## Security & Configuration Tips
- Keep secrets in `.env` files; never commit API keys for OpenAI, Anthropic, Google, or Prisma connections.
- Rotate the `DATABASE_URL` credentials and regenerate Prisma clients immediately when connection details change.
- Review `src/lib/auth.ts` and `src/inngest/functions.ts` for env dependencies whenever adding new agents or background jobs.
