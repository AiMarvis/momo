# Kuku OS Grill-With-Docs Review

Date: 2026-06-27
Status: Documentation stress test completed

## Reviewed Inputs

- `../CONTEXT.md`
- `../superpowers/specs/2026-06-27-kuku-fork-dashboard-design.md`
- `2026-06-27-kuku-os-architecture.md`
- `2026-06-27-kuku-os-user-flows.md`
- `2026-06-27-kuku-os-prd.md`
- `../superpowers/plans/2026-06-27-kuku-os-mvp-implementation-plan.md`
- `2026-06-27-kuku-os-issue-breakdown.md`

## Verdict

The MVP direction is coherent if the product keeps one hard boundary: Kuku OS is a Kuku fork with an operating dashboard, not a new task app that happens to store Markdown.

The current docs consistently protect that boundary:

- Vault remains source of truth.
- Kuku note features are preserved.
- Life Project and Build Project are separated in UI and domain language.
- Organize Inbox is the only fully working MVP Agent Run.
- Safe Auto means auto-apply after explicit user action, not background automation.
- Codex CLI is primary, OpenAI API BYOK is secondary or approved fallback.
- AI providers return Agent Plans, not direct file edits.

## Questions Asked and Recommended Answers

### 1. Is this a fork or a separate Mac app?

Recommended answer: fork Kuku.

Reason: the strongest user desire is preserving Kuku's vault, notes, graph, search, editor, backlinks, and existing AI foundation. A separate app would recreate Kuku's core and drift from upstream.

Decision captured in: `../adr/0001-build-on-the-kuku-fork.md`

### 2. Does the dashboard replace the note app?

Recommended answer: no.

The dashboard is the first working surface, but notes remain first-class. The left navigation must keep the vault visible so existing Kuku or Obsidian-like users immediately understand their notes are still intact.

### 3. Is Life work just another issue tracker lane?

Recommended answer: no.

Life work uses Tasks, Schedule Blocks, Follow-ups, and linked notes. Issues belong only to Build work in the MVP. This protects non-developer friendliness.

### 4. Should hybrid projects exist?

Recommended answer: no for MVP.

Each project has exactly one `project_type`: `life` or `build`. Cross-boundary work uses related links. A hybrid type would blur the dashboard and make filtering harder.

### 5. Can the agent run in the background?

Recommended answer: no.

Safe Auto applies only after the user explicitly starts an Agent Run. Background organization is excluded from MVP because it would undermine trust before receipts, undo, and provider cost boundaries are proven.

### 6. Can OpenAI API fallback happen silently?

Recommended answer: no.

Fallback after Codex failure requires explicit approval every time. Direct OpenAI API runs are allowed after BYOK setup, but the UI must show a lightweight provider indicator because API cost may occur.

### 7. Should the AI directly mutate files?

Recommended answer: no.

Providers must return a structured Agent Plan. The app validates the plan, splits safe vs risky changes, maps domain objects to Kuku mutations, applies through path guards and checksums, writes Run Log, and creates Undo Plan.

Decision captured in: `../adr/0002-apply-ai-output-through-agent-plans.md`

### 8. Should Organize Inbox support batch mode?

Recommended answer: no for MVP.

One run processes exactly one Inbox Note. This keeps receipts, undo, source links, and duplicate prevention understandable.

### 9. Should a processed Inbox Note be rewritten?

Recommended answer: no.

The original body stays. The app adds processing metadata and a short `Organized into` section only. This preserves source trust.

### 10. Should Undo be per-item?

Recommended answer: no for MVP.

Undo is whole-run only. Per-item undo would require a more complex mutation history and create ambiguous states when source metadata and generated files diverge.

## Consistency Checks

No glossary conflicts found.

Terms used consistently:

- `Vault`, not database
- `Starter Workspace`, not sample project
- `Today Dashboard`, not homepage
- `Life Project` and `Build Project`, not generic project lanes
- `Managed Task` vs `Checklist Item`
- `Issue` only for Build workflows
- `Agent Run`, not background job
- `Agent Plan`, not chat answer
- `Safe Auto Change`, not full auto mode
- `Approval-Required Change`, not manual task
- `Change Receipt`, not diff
- `Run Log`, not transcript
- `Undo Plan`, not backup

## Risks Found

### Risk 1. The MVP can become too broad.

The docs include Today Dashboard, Life Projects, Build Projects, Weekly Planning, Codex setup, OpenAI BYOK, Organize Inbox, receipts, undo, and re-run. The implementation plan mitigates this by shipping in vertical slices and making Organize Inbox the first agent action.

### Risk 2. AI safety depends on Kuku mutation integration.

If implementation bypasses Kuku's existing mutation safety, the product loses its trust story. The architecture and ADR require Agent Plans to be applied through app-owned validation and mutation runtime.

### Risk 3. Non-developer friendliness could regress if Build language leaks into Life.

Life pages must avoid Issue, priority, backlog, doing, and blocked language. Build pages can keep issue terms.

### Risk 4. Provider fallback can create cost surprises.

OpenAI fallback must be explicit after Codex failure. Direct OpenAI API provider use needs a setup cost notice and a lightweight active provider indicator.

### Risk 5. Upstream Kuku updates may conflict with forked UI.

The implementation plan keeps additions mostly inside `apps/desktop` and extends existing crates only where necessary. This should make upstream merging easier than a large rewrite.

## Documentation Updates Made

- Added architecture doc.
- Added user-flow doc.
- Added PRD.
- Added implementation plan.
- Added issue breakdown.
- Added ADR for Kuku fork base.
- Added ADR for Agent Plan mutation boundary.
- No `../CONTEXT.md` term changes were needed because current terms already covered the resolved decisions.

## Remaining Product Questions

These are not blockers for MVP planning, but they should be answered before detailed UI implementation:

1. Should Weekly Planning appear in the left navigation at launch, or only inside Today?
2. Should Build Project issue list include a board toggle in MVP as disabled affordance, or omit it entirely?
3. What is the exact command UX for `Open Codex setup` on macOS: open Terminal with a suggested command, open docs, or show copyable command guidance?
4. Should the app create example Starter Workspace notes, or only empty folders?
5. Should the first release name remain Kuku OS internally while the app title remains Kuku?
