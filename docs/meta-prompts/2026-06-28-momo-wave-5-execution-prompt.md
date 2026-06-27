# Momo Wave 5 Execution Prompt

Use this prompt to continue Momo after the Wave 4 provider/receipt work.

```text
You are Codex continuing Momo implementation from the existing workspace.

Workspace root:
/Users/innerbuilder/Library/CloudStorage/GoogleDrive-aimarvis00@gmail.com/내 드라이브/codex-project/macapps

Momo repo:
momo

App checkout:
momo/app

Current pushed commit:
5e54f3c feat: add agent provider receipt flow

Start by reading these files in order:

1. momo/docs/CONTEXT.md
2. momo/docs/superpowers/plans/2026-06-27-kuku-os-mvp-implementation-plan.md
3. momo/docs/kuku-os/2026-06-27-kuku-os-issue-breakdown.md
4. momo/docs/adr/0001-build-on-the-kuku-fork.md
5. momo/docs/adr/0002-apply-ai-output-through-agent-plans.md
6. momo/docs/meta-prompts/2026-06-28-momo-wave-5-execution-prompt.md
7. .omo/plans/momo-kuku-os-first-vertical-slice.md
8. .omo/evidence/wave-4-verification-summary.json
9. .omo/evidence/wave-4-native-gui-status.md
10. .omo/evidence/momo-direct-native-qa-2026-06-28.md

Current status:

- Wave 1 through Wave 4 code paths are implemented.
- Wave 4 provider adapter and Change Receipt work is committed and pushed.
- Focused Wave 4 checks passed:
  - provider/receipt Vitest
  - receipt Solid render test
  - adjacent regression Vitest
  - scoped oxfmt
  - scoped oxlint
  - tsc --noEmit
- Broad pnpm check is still blocked by a Moon/Git path classification issue in the Google Drive checkout.
- Native app direct QA now partially passes:
  - tauri:dev launches.
  - the real macOS dev window renders Momo Today.
  - Momo workspace, Quick Inbox, Agent states, and Codex setup panel are visible.
  - native screenshot capture works.
  - native mouse scrolling works.
- Native GUI interaction remains blocked:
  - installed /Applications/Kuku.app and dev Kuku share bundle id mom.kuku.app, confusing Computer Use.
  - Computer Use attaches to the installed app when using app name Kuku.
  - targeting the dev bundle path opens a second blank window.
  - the actual tauri:dev process renders correctly but does not expose inner WebView controls to Computer Use/System Events.
  - Quick Inbox text entry and Capture click were not observed working through native automation.

Continue with Wave 5:

Implement one-note Organize Inbox safe-auto runtime.

Goal:

Given exactly one selected Inbox Note, the app should:

1. build a bounded context from that one source note and relevant existing Momo outputs;
2. request a structured Agent Plan through the provider adapter;
3. validate the Agent Plan with the existing schema;
4. block invalid plans with no partial apply;
5. apply safe creates/updates only after explicit user action;
6. never apply approval-required changes in this slice;
7. preserve the source Inbox Note body and mark it processed with organized links;
8. write exactly one Run Log, one Change Receipt, and one Undo Plan under .AgentRuns;
9. show the Change Receipt from Wave 4;
10. reject multiple selected Inbox Notes.

Important constraints:

- Preserve existing Kuku Markdown vault, editor, wikilinks, backlinks, search, graph, and AI chat behavior.
- MVP is Mac-only and local-first.
- Do not add SaaS backend, mobile app, external calendar sync, Linear sync, Notion sync, Slack, Gmail, team collaboration, comments, assignees, cycles, or background auto-organization.
- Apply AI output only through structured Agent Plans, never direct provider file edits.
- Codex CLI is primary Agent Provider.
- OpenAI API BYOK is secondary/direct only when Codex is not ready, or explicit fallback after Codex failure and user approval.
- OpenAI API keys must live only in macOS Keychain.
- Safe Auto applies only after explicit user action.
- Organize Inbox processes exactly one Inbox Note in MVP.
- Invalid Agent Plan means no partial apply.
- Every Agent Run creates a Run Log, Change Receipt, and Undo Plan.
- Undo is whole-run only and must not overwrite user edits.

Google Drive workspace rule:

Before running installs/builds, use the existing nosync setup:

export MOMO_ROOT="/Users/innerbuilder/Library/CloudStorage/GoogleDrive-aimarvis00@gmail.com/내 드라이브/codex-project/macapps/momo"
export MOMO_APP="$MOMO_ROOT/app"
export MOMO_NOSYNC="$HOME/.nosync/momo"
export CARGO_HOME="$MOMO_NOSYNC/cargo-home"
export CARGO_TARGET_DIR="$MOMO_NOSYNC/cargo-target"

Do not create heavy dependency/build directories inside Google Drive.

Suggested first move:

1. Diagnose the native GUI interaction blocker enough to decide whether Wave 5 can be driven through the native surface this turn.
2. If native automation remains blocked, still implement Wave 5 through the smallest trustworthy code seam and capture the blocker honestly.
3. Prefer fake provider responses for automated tests. Do not call real OpenAI or mutate user vault content in tests.
4. Use a temp vault for integration tests.
5. Before ending, run focused tests for changed files and update .omo evidence/plan files with real status.
6. Do not mark native GUI QA passed unless you actually drive the dev app through the native Mac surface and observe the one-note Organize Inbox flow working.
```
