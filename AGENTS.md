# Repository Guidelines

## Project Structure & Module Organization
- The App Router lives in `src/app` with route groups `(auth)` and `(dashboard)` plus API handlers in `src/app/api`.
- Shared UI primitives stay in `src/components/ui`, and layout shells like `app-sidebar.tsx` sit alongside them.
- Domain logic splits across `src/features`, reusable hooks, and utilities in `src/hooks` and `src/lib`, while background jobs run from `src/inngest`.
- Prisma’s schema sits in `prisma/schema.prisma` and generates to `src/generated/prisma`; static assets belong in `public/`.

## Build, Test, and Development Commands
- `npm run dev` — launch the development server on port 3000.
- `npm run build` — produce the production bundle with type checks.
- `npm run start` — serve the production bundle; run after `npm run build`.
- `npx prisma generate` — refresh the Prisma client after schema changes (pair with `npx prisma migrate dev --name <change>` when altering tables).

## Coding Style & Naming Conventions
- Author modern TypeScript React components using functional patterns; default to server components unless client hooks (React Query, forms) require otherwise.
- Keep filenames kebab-cased (`app-sidebar.tsx`, `use-mobile.ts`) and export a single component per file with colocated helpers.
- Tailwind CSS v4 powers styling via `globals.css`; prefer utility-first classes and compose variants with `class-variance-authority` when sharing patterns.
- Group imports as framework → third-party → internal and rely on editor formatting with 2-space indentation.

## Testing Guidelines
- Add React Testing Library smoke tests as `*.test.tsx` colocated with the unit under test.
- Exercise tRPC procedures and Inngest workflows with integration tests that seed Prisma against a disposable database or mocked adapter.
- Call out any temporary coverage gaps directly in the pull request description.

## Commit & Pull Request Guidelines
- Mirror the existing concise, lowercase style (`update: add ai providers`): action verb, short scope, one responsibility.
- Include in every PR: a summary, linked issue or ticket, test evidence (`npm run build`, screenshots for UI), and notes on schema or env changes.
- Request review from the relevant feature owner and confirm required AI provider keys are present before merging.

## Security & Configuration Tips
- Keep credentials in `.env`; never commit secrets for Prisma, OpenAI, Anthropic, or Google providers.
- Rotate `DATABASE_URL` promptly, rerun `npx prisma generate`, and audit auth or Inngest modules when adding new agents or background workers.
