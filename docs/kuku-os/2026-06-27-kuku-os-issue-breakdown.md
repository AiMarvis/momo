# Kuku OS MVP Issue Breakdown

Date: 2026-06-27
Status: Draft issue list for Kuku fork implementation

## Issue Format

Each issue should be shippable as a vertical slice where possible. Dependencies are listed only when the issue should not start first.

## MVP Issues

### 1. Fork Kuku and map implementation paths

Type: setup

Scope:

- fork or clone `kuku-mom/kuku`;
- run existing checks;
- map current app shell, vault commands, mutation path, AI host, and indexer boundaries;
- record exact path map in fork docs.

Acceptance:

- desktop app builds before Kuku OS changes;
- existing notes, editor, search, graph, backlinks, and AI chat smoke test passes.

### 2. Add Starter Workspace folders

Type: foundation

Depends on: Issue 1

Scope:

- create `/Inbox`, `/Daily`, `/Tasks`, `/Projects`, `/Issues`, `/Calendar`, `/Knowledge`, `/.AgentRuns`;
- support existing folder open without destructive migration;
- offer to add missing folders only.

Acceptance:

- new workspace has all folders;
- existing Markdown folder is preserved.

### 3. Add operating domain model parsing

Type: foundation

Depends on: Issue 1

Scope:

- parse Project, Managed Task, Issue, Schedule Block, Planning Candidate, Inbox Note, Processed Inbox Note, Run Log;
- validate allowed statuses and priorities;
- expose dashboard-ready queries.

Acceptance:

- invalid metadata does not crash UI;
- Tasks and Issues remain separate;
- Life Projects and Build Projects use one `project_type` field.

### 4. Build Kuku-style Today Dashboard shell

Type: UI

Depends on: Issues 2, 3

Scope:

- add Today as first screen;
- preserve left Kuku vault navigation;
- create Life lane left and Build lane right;
- create right Agent panel shell;
- apply dark neutral, thin-border, low-radius Kuku style.

Acceptance:

- user can see Life work and Build work at the same time;
- notes, search, graph, and editor remain reachable.

### 5. Add quick Inbox capture

Type: UI plus storage

Depends on: Issues 2, 4

Scope:

- capture messy idea from Today Dashboard;
- save it as Markdown under `/Inbox`;
- select created note for agent panel.

Acceptance:

- user can capture without choosing note/task/project/issue;
- original text is preserved.

### 6. Add Processed Inbox Note state

Type: UI plus metadata

Depends on: Issues 3, 5

Scope:

- detect `processed: true`;
- show `View receipt`, `Undo run`, `Re-run organize`;
- prevent default re-processing.

Acceptance:

- already processed notes do not trigger Organize Inbox automatically;
- user can explicitly choose re-run.

### 7. Add Codex Readiness Check and setup guidance

Type: platform

Depends on: Issue 1

Scope:

- shallow executable/auth readiness check;
- statuses: `Codex CLI not found`, `Login required`, `Check timed out`;
- first-run Codex Setup Guidance screen;
- `Open Codex setup`, `Check again`, `Continue without agent`.

Acceptance:

- app can continue without agent;
- no token or credential files are inspected.

### 8. Add OpenAI API BYOK storage and provider status

Type: platform

Depends on: Issue 7

Scope:

- store user API key only in macOS Keychain;
- show setup cost notice;
- show lightweight provider indicator;
- add safe diagnostic copy without sensitive fields.

Acceptance:

- key is not written to vault, config, localStorage, Run Log, or diagnostics;
- direct OpenAI API provider can be ready when Codex is not.

### 9. Define Agent Plan schema for Organize Inbox

Type: agent foundation

Depends on: Issues 3, 7, 8

Scope:

- structured domain-level creates and updates;
- support Managed Task, Build Issue, Project, Schedule Block, Planning Candidate, source links, processed marker;
- include provider metadata.

Acceptance:

- provider output cannot be applied unless it matches schema;
- schema does not expose low-level file patches as the provider contract.

### 10. Add Agent Plan validator and failed-run path

Type: safety

Depends on: Issue 9

Scope:

- validate required fields, enum values, source note, project type, and target kind;
- invalid plan writes failed Run Log with validation summaries only;
- no partial apply.

Acceptance:

- one invalid item blocks the whole run;
- full invalid plan, prompt, and model response are not stored.

### 11. Implement provider adapters

Type: agent

Depends on: Issues 7, 8, 9, 10

Scope:

- Codex CLI adapter as primary;
- OpenAI API BYOK adapter as secondary;
- explicit fallback approval after Codex failure;
- provider metadata in Run Log.

Acceptance:

- fallback is never silent;
- fallback approval timestamp and reason are recorded when used.

### 12. Implement Organize Inbox safe auto apply

Type: vertical slice

Depends on: Issues 5, 9, 10, 11

Scope:

- process exactly one Inbox Note;
- build context;
- request Agent Plan;
- apply Safe Auto Changes through Kuku mutation path;
- create Tasks, Issues, Projects, Schedule Blocks, Planning Candidates, source links, and processed metadata;
- write Run Log and Undo Plan;
- show Change Receipt.

Acceptance:

- one run has one source note, one receipt, one log, one undo plan;
- safe-only run applies without pre-apply review.

### 13. Add Approval Review for risky changes

Type: safety UI

Depends on: Issue 12

Scope:

- split safe vs approval-required changes;
- show review only for risky changes;
- allow approve, skip, or cancel.

Acceptance:

- deleting, moving, renaming, large body edits, existing object changes, and external syncs require approval;
- safe changes remain visible in receipt.

### 14. Build Change Receipt

Type: UI

Depends on: Issues 12, 13

Scope:

- show work outcomes first;
- sections: Created Tasks, Created Issues, Suggested Schedule, New or Linked Projects, Needs approval, Undo;
- put file paths in collapsed details;
- show provider note only for OpenAI API fallback.

Acceptance:

- non-developer can understand what changed without reading file diffs.

### 15. Implement whole-run Undo

Type: safety

Depends on: Issues 12, 14

Scope:

- load Run Log and Undo Plan;
- delete created files when unchanged;
- remove processed metadata and organized links;
- remove small tags/backlinks/source links;
- skip changed files and show Undo Conflict.

Acceptance:

- later user edits are not overwritten;
- undo result is visible in the receipt or result panel.

### 16. Implement explicit Re-run organize

Type: agent safety

Depends on: Issues 6, 12, 15

Scope:

- start only from explicit user action;
- read prior `agent_run` and `Organized into` links;
- avoid duplicate tasks, issues, and projects;
- send uncertain changes to approval.

Acceptance:

- re-run may add missing bookkeeping links safely;
- meaningful existing output edits require approval.

### 17. Add Life Project detail view

Type: UI

Depends on: Issues 3, 4

Scope:

- Timeline plus Next Actions view;
- show people, meetings, lectures, follow-ups, schedule blocks, linked notes;
- avoid Issue language.

Acceptance:

- Life work feels non-developer-friendly.

### 18. Add Build Project issue list view

Type: UI

Depends on: Issues 3, 4

Scope:

- Issue List view with status, priority, due date, blocked flag, linked notes;
- no team concepts, comments, assignees, cycles, or roadmaps.

Acceptance:

- Build work feels Linear-like but solo-friendly.

### 19. Add small Weekly Planning surface

Type: UI

Depends on: Issues 3, 4, 17, 18

Scope:

- this week's Life work;
- this week's Build work;
- active issues;
- blocked items;
- unfinished items to reschedule.

Acceptance:

- useful weekly planning exists without becoming a full calendar or sprint planner.

### 20. Preserve Kuku feature smoke tests

Type: regression

Depends on: all user-facing issues

Scope:

- notes;
- editor;
- wikilinks;
- backlinks;
- search;
- graph;
- existing AI chat;
- local vault ownership.

Acceptance:

- Kuku OS additions do not break core Kuku workflows.

### 21. Visual QA and accessibility pass

Type: quality

Depends on: Issues 4, 7, 12, 14, 17, 18, 19

Scope:

- desktop viewport checks;
- no text overlap;
- readable compact typography;
- clear focus states;
- buttons/icons understandable with labels or tooltips;
- dark neutral Kuku-style polish.

Acceptance:

- Today Dashboard, Codex Setup, Organize Inbox, Approval Review, and Change Receipt pass visual review.

## Recommended Build Order

1. Issues 1-3: fork, folders, domain parsing
2. Issues 4-6: dashboard and Inbox capture
3. Issues 7-11: provider readiness and agent plan foundation
4. Issues 12-16: Organize Inbox, receipt, undo, re-run
5. Issues 17-19: detail views and Weekly Planning
6. Issues 20-21: regression, QA, polish
