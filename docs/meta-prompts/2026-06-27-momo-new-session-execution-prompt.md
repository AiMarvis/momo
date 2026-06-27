# Momo New Session Execution Prompt

Use this prompt to start a fresh Codex session for implementing Momo from the current planning docs.

```text
You are Codex working on Momo, a Kuku fork that turns Kuku into a local-first Mac personal operating workspace. The user wants a cute, non-developer-friendly app where daily life, projects, and a second brain live together.

Start by reading these docs in order:

1. momo/docs/CONTEXT.md
2. momo/docs/kuku-os/2026-06-27-kuku-os-prd.md
3. momo/docs/kuku-os/2026-06-27-kuku-os-architecture.md
4. momo/docs/kuku-os/2026-06-27-kuku-os-user-flows.md
5. momo/docs/kuku-os/2026-06-27-kuku-os-grill-with-docs.md
6. momo/docs/superpowers/plans/2026-06-27-kuku-os-mvp-implementation-plan.md
7. momo/docs/kuku-os/2026-06-27-kuku-os-issue-breakdown.md
8. momo/docs/adr/0001-build-on-the-kuku-fork.md
9. momo/docs/adr/0002-apply-ai-output-through-agent-plans.md

Then execute the implementation plan from the smallest useful vertical slice:

1. Fork or clone upstream Kuku into momo/app, not directly into momo/, so momo/docs remains stable.
2. Preserve Kuku's existing Markdown vault, editor, wikilinks, backlinks, search, graph, and AI chat behavior.
3. Build Momo as a Mac-only Kuku fork first. Do not add SaaS backend, mobile app, external calendar sync, Linear sync, Notion sync, Slack, Gmail, team collaboration, comments, assignees, cycles, or background auto-organization in MVP.
4. Implement the first useful path: Starter Workspace -> Today Dashboard -> quick Inbox capture -> Codex setup guidance -> Organize Inbox for one Inbox Note -> Change Receipt -> whole-run Undo.

Important Google Drive workspace rule:

The workspace is inside Google Drive:

/Users/innerbuilder/Library/CloudStorage/GoogleDrive-aimarvis00@gmail.com/내 드라이브/codex-project/macapps/momo

Do not create heavy dependency/build directories inside Google Drive. Before installing dependencies, create an external nosync area and symlink heavy folders into the repo checkout.

Use this setup before running pnpm/npm/cargo builds:

export MOMO_ROOT="/Users/innerbuilder/Library/CloudStorage/GoogleDrive-aimarvis00@gmail.com/내 드라이브/codex-project/macapps/momo"
export MOMO_APP="$MOMO_ROOT/app"
export MOMO_NOSYNC="$HOME/.nosync/momo"

mkdir -p "$MOMO_NOSYNC"/{node_modules,pnpm-store,target,cargo-home,cargo-target,turbo,vite,dist}

mkdir -p "$MOMO_APP"
ln -sfn "$MOMO_NOSYNC/node_modules" "$MOMO_APP/node_modules"
ln -sfn "$MOMO_NOSYNC/target" "$MOMO_APP/target"
ln -sfn "$MOMO_NOSYNC/turbo" "$MOMO_APP/.turbo"
ln -sfn "$MOMO_NOSYNC/vite" "$MOMO_APP/.vite"
ln -sfn "$MOMO_NOSYNC/dist" "$MOMO_APP/dist"

pnpm config set store-dir "$MOMO_NOSYNC/pnpm-store" --location project
export CARGO_HOME="$MOMO_NOSYNC/cargo-home"
export CARGO_TARGET_DIR="$MOMO_NOSYNC/cargo-target"

If the Kuku fork uses nested package directories that generate their own node_modules or build outputs, create symlinks for those too before installing.

Implementation constraints:

- Apply AI output through structured Agent Plans, never direct provider file edits.
- Codex CLI is the primary Agent Provider.
- OpenAI API BYOK is secondary or explicit fallback only.
- OpenAI API keys must live only in macOS Keychain.
- Safe Auto applies only after explicit user action.
- Organize Inbox processes exactly one Inbox Note in MVP.
- Invalid Agent Plan means no partial apply.
- Every Agent Run creates a Run Log, Change Receipt, and Undo Plan.
- Undo is whole-run only and must not overwrite user edits.

Use the docs as source of truth. If implementation details conflict with docs, stop and update the docs or ask the user before drifting.
```
