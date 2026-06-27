# Kuku OS MVP PRD

Date: 2026-06-27
Status: Draft PRD based on approved dashboard direction and grill-with-docs decisions

## Summary

Kuku OS is a local-first Mac workspace for solo builders. It forks Kuku and preserves Kuku's Markdown vault, notes, graph, search, backlinks, editor, and existing AI chat. The MVP adds a friendly Today Dashboard that can manage knowledge, personal schedules, Life Projects, Build Projects, and one safe AI agent action: Organize Inbox.

Korean positioning:

```text
혼자 만드는 사람을 위한 로컬 우선 AI 작업 운영체제.
```

## Problem

Solo builders often split their work across Obsidian, Notion, Linear, calendar tools, and loose AI chats. This creates a specific kind of friction:

- ideas are captured before the user knows whether they are notes, tasks, projects, issues, or schedule blocks;
- personal and offline work does not fit Linear-like issue language;
- app, web, and service work benefits from Linear-like structure;
- knowledge notes should stay local and durable;
- AI help is useful only if the user can see what changed and undo it.

## Target User

The first user is a solo builder, developer, creator, founder, lecturer, or operator who wants one Mac workspace for:

- knowledge management;
- daily and personal task management;
- meetings, lectures, people-driven projects, and offline follow-ups;
- app, web, service, or product build management;
- AI-assisted organization that does not silently mutate important notes.

## Product Goal

Make Kuku's first screen feel like an operating dashboard while preserving Kuku as a local Markdown knowledge app.

The user should feel:

```text
I can see today, capture ideas, organize them safely, and still own my notes.
```

## MVP Scope

Included:

- Mac app only
- Kuku fork, not a separate app
- Starter Workspace onboarding
- Kuku-style dark neutral Today Dashboard
- Life lane and Build lane visible together
- quick Inbox capture
- Project type: `life | build`
- Managed Tasks and Checklist Items as separate concepts
- Build-only Issues
- local Schedule Blocks and Planning Candidates
- small Weekly Planning surface
- Codex Setup Guidance during first run
- Codex CLI as primary Agent Provider
- OpenAI API BYOK as secondary provider and explicit fallback path
- OpenAI API key stored only in macOS Keychain
- Organize Inbox as the only fully working MVP Agent Run
- Safe Auto Changes after explicit user action
- Approval Review for risky changes
- Change Receipt and whole-run Undo Plan
- existing Kuku notes, graph, search, editor, wikilinks, backlinks, and AI chat preserved

Excluded:

- Google Calendar sync
- Apple Calendar sync
- Linear API sync
- Notion API sync
- Slack, Gmail, or external app integrations
- team collaboration
- comments, assignees, cycles, sprints, roadmaps
- public SaaS backend
- mobile or iOS companion
- background auto-organization
- batch Organize Inbox
- per-item undo

## Visual Direction

Approved direction: friendly Today Home adapted to Kuku style.

- dark neutral surfaces
- thin borders
- low radius
- compact operational layout
- left vault navigation preserved
- right agent or inspector panel preserved
- no marketing hero
- no decorative gradients or orbs
- no developer-only issue-tracker feeling

![Today dashboard mockup](../assets/kuku-os/kuku-os-today-dashboard.png)

## Requirements

### R1. Starter Workspace

The app must create a recommended local Markdown workspace:

```text
/Inbox
/Daily
/Tasks
/Projects
/Issues
/Calendar
/Knowledge
/.AgentRuns
```

Opening an existing Kuku or Obsidian-style folder remains available. The app should preserve existing notes and offer to add only missing operating folders.

### R2. Today Dashboard

The Today Dashboard is the first working screen. It must show:

- today's Life work;
- today's Build work;
- quick Inbox capture;
- related notes;
- agent action state;
- access back to Kuku notes, search, graph, and editor.

Life appears on the left. Build appears on the right.

### R3. Life Projects

Life Projects are for people, meetings, lectures, errands, offline work, and follow-ups. They use Tasks, Schedule Blocks, and linked notes. They do not use Issues in the MVP.

Default Life Project view: Timeline plus Next Actions.

### R4. Build Projects

Build Projects are for app, web, service, and product work. They use Issues, project status, due date, priority, blocked flag, and linked notes.

Default Build Project view: Issue List. Board view can come later.

### R5. Tasks, Issues, Ideas

Managed Task:

- Markdown file with frontmatter
- `status: todo | done`
- optional `important: true`
- no issue-style priority

Issue:

- Build-only work item
- `status: backlog | todo | doing | done`
- `priority: low | medium | high`
- optional `blocked: true`

Idea:

- starts as Inbox content
- becomes a note, task, project, issue, Planning Candidate, or Schedule Block only after organization

### R6. Codex Setup Guidance

First-run IA must guide users into Codex setup early.

![Codex setup mockup](../assets/kuku-os/kuku-os-codex-setup.png)

Flow:

1. Create Starter Workspace or open existing folder.
2. Run shallow Codex Readiness Check.
3. If Codex is ready, continue to Today Dashboard with agent enabled.
4. If Codex is missing, logged out, or timed out, show Codex Setup Guidance.
5. Allow Continue without agent.

The app does not install Codex CLI or manage Codex login inside the app.

### R7. Agent Provider Selection

Provider selection is automatic:

1. Codex CLI when installed and apparently authenticated.
2. OpenAI API BYOK when Codex is not ready and a key is configured.
3. Agent Setup Required when neither is ready.

Direct OpenAI API use after setup does not require per-run approval, but the UI must show a lightweight provider indicator. Fallback from Codex to OpenAI API requires explicit approval each time.

### R8. Organize Inbox

Organize Inbox is the first and only fully working MVP Agent Run.

Rules:

- one run processes exactly one Inbox Note;
- multiple selected notes show batch unavailable or ask user to choose one;
- original Inbox Note body is preserved;
- processed note adds metadata and a short `Organized into` section;
- project creation is safe only when intent is clear;
- ambiguous items become lighter objects;
- every run creates one Run Log, one Undo Plan, and one Change Receipt.

![Organize Inbox flow mockup](../assets/kuku-os/kuku-os-organize-inbox-flow.png)

### R9. Agent Plan Validation

Codex CLI and OpenAI API must return a structured Agent Plan. The app validates the plan before applying any changes.

Invalid Agent Plan:

- no partial apply;
- no vault changes;
- failed Run Log with validation summaries only;
- no full prompt, full response, reasoning trace, token log, or credentials stored.

### R10. Safe Auto and Approval

Safe Auto Changes apply after explicit Agent Run start. Approval-Required Changes pause for review.

Approval is required for deletion, rename, move, large body replacement, bulk status changes, meaningful existing-note edits, external sync, destructive calendar changes, or changing existing Task, Issue, or Project content/status/due/priority/assignment.

### R11. Change Receipt

Change Receipt must lead with user-facing work outcomes:

- Created Tasks
- Created Issues
- Suggested Schedule
- New or Linked Projects
- Needs approval
- Undo

File paths belong in collapsed details.

### R12. Undo

Undo is whole-run only in MVP.

It should:

- delete files created by the run when unchanged;
- remove processed metadata and organized links from the source Inbox Note;
- remove small tags, backlinks, and source links added by the run;
- skip targets changed after the run and show Undo Conflict.

## User Stories

- As a solo builder, I can open the app and immediately see Life work and Build work for today.
- As a non-developer, I can manage meetings, lectures, errands, and follow-ups without seeing issue-tracker language.
- As a builder, I can manage app/web/service work as issues with status, priority, due date, and blocked context.
- As a note-first user, I can keep using Kuku notes, graph, search, editor, wikilinks, and backlinks.
- As a busy user, I can write a messy Inbox Note without deciding its type.
- As a cautious user, I can let the agent organize one Inbox Note and still see exactly what changed.
- As a user with Codex CLI, I can use Codex auth without entering an OpenAI API key.
- As a user without Codex ready, I can keep using the app without agent features.
- As a BYOK user, I can add an OpenAI API key and understand that API cost may occur.
- As a user, I can undo a whole Agent Run if the result is not what I wanted.

## Success Criteria

The MVP is successful when a non-developer can understand:

- what to do today;
- what is Life work vs Build work;
- where to capture ideas;
- what the agent will do;
- what was created;
- what needs approval;
- how to undo;
- how to return to normal Kuku notes.

First useful moment:

```text
Write or paste one Inbox note
-> click Organize Inbox
-> see work outcomes first
-> safe changes apply automatically
-> risky changes ask for approval
-> review the Change Receipt or undo the run
```

## Open Decisions for Build Start

- Exact upstream component boundaries inside `apps/desktop/src` after forking.
- Whether Agent Plan schema lives first in `crates/kuku-ai`, `packages/contract`, or Tauri-only commands.
- Whether dashboard indexing can reuse current indexer output or needs new derived queries.
- How much of Weekly Planning appears in the first clickable prototype.
