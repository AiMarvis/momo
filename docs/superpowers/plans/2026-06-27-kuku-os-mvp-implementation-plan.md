# Kuku OS MVP Implementation Plan

Date: 2026-06-27
Status: Ready for fork implementation planning

## References

- PRD: `../../kuku-os/2026-06-27-kuku-os-prd.md`
- Architecture: `../../kuku-os/2026-06-27-kuku-os-architecture.md`
- User flows: `../../kuku-os/2026-06-27-kuku-os-user-flows.md`
- Existing spec: `../specs/2026-06-27-kuku-fork-dashboard-design.md`
- Domain glossary: `../../CONTEXT.md`
- Upstream Kuku checked on 2026-06-27:
  - `apps/desktop`
  - `apps/desktop/src`
  - `apps/desktop/src-tauri/src`
  - `crates/kuku-ai`
  - `crates/kuku-contract`
  - `crates/kuku-indexer`
  - `packages/contract`

## Implementation Stance

Build on the Kuku fork, not beside it. Keep existing Kuku note behavior intact and add the operating layer in thin vertical slices.

The current workspace contains planning docs and assets, not the forked source tree. After the fork is cloned into this workspace, map the target files below to the exact current Kuku structure before coding. The path names are based on upstream Kuku's `main` branch checked on 2026-06-27.

## Phase 0. Fork Intake and Path Mapping

Goal: make the implementation plan concrete against the actual fork checkout.

Target areas:

- `apps/desktop/src/app.tsx`
- `apps/desktop/src/components`
- `apps/desktop/src/stores`
- `apps/desktop/src/lib`
- `apps/desktop/src/styles`
- `apps/desktop/src-tauri/src/lib.rs`
- `apps/desktop/src-tauri/src/models.rs`
- `apps/desktop/src-tauri/src/plugin_fs.rs`
- `apps/desktop/src-tauri/src/plugin_secrets.rs`
- `apps/desktop/src-tauri/src/secure_storage.rs`
- `apps/desktop/src-tauri/src/ai_host`
- `apps/desktop/src-tauri/src/ai_tools`
- `crates/kuku-ai`
- `crates/kuku-indexer`
- `packages/contract/proto`

Tasks:

1. Clone or fork Kuku into the workspace.
2. Run existing checks once: `pnpm install`, `pnpm check`, `pnpm test` or the repo's current equivalents.
3. Identify the current app shell, sidebar, editor, AI panel, vault file commands, and mutation flow.
4. Write a short path map inside the fork docs so later tasks use exact files.

Acceptance:

- Existing desktop app still builds.
- Existing Kuku notes, graph, search, editor, and AI chat behavior is unchanged.

## Phase 1. Domain Models and Starter Workspace

Goal: establish the Markdown operating model without changing UI deeply.

Likely files:

- `apps/desktop/src-tauri/src/models.rs`
- `apps/desktop/src-tauri/src/knowledge`
- `apps/desktop/src-tauri/src/plugin_fs.rs`
- `apps/desktop/src/lib`
- `crates/kuku-indexer`

Tasks:

1. Add TypeScript/Rust domain shapes for Project, Managed Task, Issue, Schedule Block, Planning Candidate, Inbox Note, Processed Inbox Note, Run Log.
2. Add Starter Workspace creation for `/Inbox`, `/Daily`, `/Tasks`, `/Projects`, `/Issues`, `/Calendar`, `/Knowledge`, `/.AgentRuns`.
3. Add frontmatter parsing and validation for the MVP fields.
4. Add derived dashboard queries that read from Markdown and existing index caches.

Acceptance:

- A new Starter Workspace creates the expected folders.
- Existing Markdown folders can be opened without migration.
- Invalid frontmatter does not crash the dashboard.

## Phase 2. Today Dashboard Shell

Goal: show the main Kuku OS surface while preserving Kuku navigation.

Likely files:

- `apps/desktop/src/app.tsx`
- `apps/desktop/src/components`
- `apps/desktop/src/stores`
- `apps/desktop/src/styles`
- `apps/desktop/src/index.css`

Tasks:

1. Add Today as the default first screen after onboarding.
2. Preserve left vault navigation and normal note routes.
3. Build center dashboard with Life lane and Build lane.
4. Build right Agent panel shell with setup, idle, running, receipt, and approval states.
5. Add compact Kuku-style visual treatment: dark neutral, thin borders, low radius, no marketing layout.

Acceptance:

- Non-developer can identify today's Life work and Build work.
- Kuku note surfaces remain reachable from the left navigation.
- Layout fits desktop widths without text overlap.

## Phase 3. Quick Inbox Capture and Processed State

Goal: make ideas cheap to capture and safe to preserve.

Likely files:

- `apps/desktop/src/components`
- `apps/desktop/src/stores`
- `apps/desktop/src-tauri/src/plugin_fs.rs`
- `apps/desktop/src-tauri/src/knowledge`

Tasks:

1. Add quick Inbox capture input on Today Dashboard.
2. Save captures as Markdown files under `/Inbox`.
3. Add selected Inbox Note state for Agent panel.
4. Render Processed Inbox Note state with `View receipt`, `Undo run`, and `Re-run organize`.
5. Prevent default re-processing of already processed notes.

Acceptance:

- User can create an Inbox Note without choosing type.
- Original Inbox Note body is preserved after processing.
- Already processed notes do not silently run again.

## Phase 4. Codex Setup Guidance and Provider Readiness

Goal: integrate Codex CLI auth as primary without taking over account management.

Likely files:

- `apps/desktop/src-tauri/src/ai_host`
- `apps/desktop/src-tauri/src/plugin_secrets.rs`
- `apps/desktop/src-tauri/src/secure_storage.rs`
- `apps/desktop/src-tauri/src/lib.rs`
- `apps/desktop/src/components`
- `apps/desktop/src/stores`

Tasks:

1. Add shallow Codex Readiness Check: executable availability and non-mutating auth/status check.
2. Add statuses: `Codex CLI not found`, `Login required`, `Check timed out`.
3. Add first-run Codex Setup Guidance screen.
4. Add Settings provider status.
5. Add OpenAI API BYOK storage through macOS Keychain only.
6. Add safe `Copy diagnostic` action with minimal fields only.

Acceptance:

- App can continue without agent.
- No token, API key, env var, raw stdout/stderr, vault path, or note content is stored or copied.
- OpenAI key never appears in vault, config files, localStorage, Run Logs, or diagnostics.

## Phase 5. Agent Plan Schema and Validation

Goal: make providers return structured domain plans only.

Likely files:

- `crates/kuku-ai`
- `apps/desktop/src-tauri/src/ai_host`
- `apps/desktop/src-tauri/src/ai_tools`
- `apps/desktop/src-tauri/src/models.rs`
- `packages/contract/proto` if generated client contracts are needed

Tasks:

1. Define Agent Plan schema for Organize Inbox.
2. Add validator for required fields, allowed statuses, allowed priorities, project type, source note, and target kinds.
3. Add validation failure path that writes failed Run Log without vault changes.
4. Add provider adapters for Codex CLI and OpenAI API BYOK.
5. Ensure provider output is never directly applied as a patch.

Acceptance:

- Invalid plans produce no partial vault changes.
- Failed Run Log stores validation summaries only.
- Natural-language provider output cannot trigger file writes.

## Phase 6. Organize Inbox Safe Auto Path

Goal: ship the first useful agent action.

Likely files:

- `crates/kuku-ai`
- `apps/desktop/src-tauri/src/ai_host`
- `apps/desktop/src-tauri/src/ai_tools`
- `apps/desktop/src-tauri/src/plugin_fs.rs`
- `apps/desktop/src-tauri/src/knowledge`
- `apps/desktop/src/components`

Tasks:

1. Build context for one selected Inbox Note.
2. Generate Agent Plan through selected provider.
3. Map Managed Tasks, Issues, Projects, Schedule Blocks, Planning Candidates, and links to Markdown files.
4. Apply Safe Auto Changes through Kuku mutation path with path guards and checksums.
5. Mark source Inbox Note as processed and append `Organized into`.
6. Write Run Log and Undo Plan under `/.AgentRuns`.
7. Show Change Receipt with work outcomes first.

Acceptance:

- One run processes one Inbox Note.
- Safe-only run does not block on pre-apply review.
- Receipt shows Created Tasks, Created Issues, Suggested Schedule, Projects, Needs approval, Undo.

## Phase 7. Approval Review for Risky Changes

Goal: keep trust when the agent wants to alter existing work.

Likely files:

- `apps/desktop/src/components`
- `apps/desktop/src/stores`
- `apps/desktop/src-tauri/src/ai_tools`
- `apps/desktop/src-tauri/src/plugin_fs.rs`

Tasks:

1. Split Agent Plan changes into Safe Auto and Approval-Required.
2. Show Approval Review only when risky changes exist.
3. Allow approve, skip, or cancel risky changes.
4. Keep safe applied changes visible in receipt.

Acceptance:

- Deletion, rename, move, large body replacement, meaningful existing content edits, and existing work-item changes require approval.
- Safe-only runs skip the review.

## Phase 8. Undo and Re-run

Goal: make Agent Runs reversible and duplicate-resistant.

Likely files:

- `apps/desktop/src-tauri/src/plugin_fs.rs`
- `apps/desktop/src-tauri/src/knowledge`
- `apps/desktop/src/components`
- `apps/desktop/src/stores`

Tasks:

1. Implement whole-run Undo Plan execution.
2. Use checksums to avoid overwriting later user edits.
3. Show Undo Conflict result when needed.
4. Implement Re-run organize from Processed Inbox Note.
5. Read prior `agent_run` and `Organized into` links to avoid duplicates.
6. Put uncertain duplicate or existing-output updates into approval.

Acceptance:

- Undo reverts safe created files and metadata when unchanged.
- Edited files become conflicts, not overwritten.
- Re-run does not silently duplicate tasks, issues, or projects.

## Phase 9. Weekly Planning and Polish

Goal: complete MVP operating loop without expanding scope.

Likely files:

- `apps/desktop/src/components`
- `apps/desktop/src/stores`
- `apps/desktop/src/styles`
- `crates/kuku-indexer`

Tasks:

1. Add small Weekly Planning surface.
2. Show Life work, Build work, active issues, blocked items, and unfinished items.
3. Add disabled or later-state agent actions only if clearly marked.
4. Run visual QA across desktop widths.
5. Run existing check, lint, format, build, and test commands.

Acceptance:

- Weekly Planning is useful but not a full calendar or sprint planner.
- MVP remains Mac-only and local-first.
- Existing Kuku features still pass smoke tests.

## Testing Plan

- Unit tests for frontmatter parsing, domain validation, Agent Plan validation, safe/approval split, provider selection, and Undo conflict detection.
- Integration tests for Starter Workspace creation, Inbox capture, Organize Inbox safe path, failed plan path, approval path, and undo path.
- UI tests for first-run setup, Today Dashboard, Processed Inbox Note state, Change Receipt, and Agent Setup Required state.
- Manual smoke tests for existing Kuku notes, editor, search, graph, backlinks, wikilinks, and AI chat.

## Implementation Guardrails

- Do not add background agent runs.
- Do not add batch organize.
- Do not parse natural language to apply mutations.
- Do not store credentials or model transcripts.
- Do not overwrite user edits during undo.
- Do not add external syncs in MVP.
- Do not let Life Projects use Issues in MVP.
