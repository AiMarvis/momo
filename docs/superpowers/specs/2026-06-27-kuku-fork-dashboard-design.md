# Kuku Fork Dashboard Design

Date: 2026-06-27
Status: Approved visual direction, pending implementation plan

Codename: Kuku OS. The production brand name will be chosen later.

Domain language for this product is captured in `../../CONTEXT.md`.

## Product Positioning

A local-first AI operating system for solo builders.

Korean positioning:

혼자 만드는 사람을 위한 로컬 우선 AI 작업 운영체제.

The product is a Kuku fork that keeps Kuku's Markdown vault, notes, graph, editor, and AI chat foundations, while adding a non-developer-friendly main dashboard for personal work, life projects, and build projects.

## Primary User

The first target user is a solo builder, developer, creator, founder, lecturer, or operator who currently splits work across tools like Obsidian, Notion, Linear, and calendar apps.

They want one local-first Mac workspace where:

- messy ideas can become tasks, projects, and schedule blocks;
- app, web, and service projects can be managed like a lightweight Linear;
- meetings, lectures, real-world errands, and people-driven projects can be managed without feeling like software engineering work;
- existing Kuku note-taking features remain available and familiar.

## Core Desire

The strongest product desire is not to replace Kuku's notes. The desire is to keep Kuku's notes intact and make the first screen a friendly operating dashboard.

The dashboard must show both worlds at the same time:

- Life / Personal OS: to-dos, daily actions, ideas, meetings, lectures, people-driven work, and offline projects.
- Build / Linear-like OS: app, web, service, product, issue, milestone, and release work.

Other notes should keep using Kuku's existing vault, editor, search, backlinks, graph, and AI chat behavior.

Life and Build should be visually separated in the dashboard. Life appears on the left and Build appears on the right. They remain connected through the same Markdown vault, search, graph, and backlinks.

## Visual Direction

Approved direction: Friendly Today Home, adapted to Kuku style.

The dashboard should feel like it belongs inside Kuku:

- dark neutral surfaces;
- thin borders;
- low border radius;
- flat panels instead of decorative cards;
- left vault navigation preserved;
- right AI panel preserved;
- center pane becomes the main Today dashboard.

It should not feel like a developer-only issue tracker. The first impression should be: "I can see what I need to do today."

## Main Layout

The main app shell keeps Kuku's three-column structure.

Left panel:

- Today
- Inbox
- Tasks
- Projects
- Daily
- Life Projects
- Build Projects
- Knowledge
- Search
- Graph
- AI Chat

Center panel:

- Today operations page
- today's Life / Build split view
- quick idea capture
- Life / people projects
- Build / software projects

Right panel:

- Agent summary
- proposed actions
- safe auto-apply button
- approval-required changes
- auto-safe toggle

The first app entry should feel like a dashboard app, not a blank notes app. The left panel must still make the Kuku / Markdown vault visible immediately so existing Kuku or Obsidian users understand that their notes remain intact.

## Dashboard Sections

### Today Actions

Shows the concrete things the user should do today.

Items can come from:

- direct to-do entry;
- issue due dates;
- local schedule blocks;
- Inbox notes organized by the agent;
- daily or weekly planning.

Today is split into Life on the left and Build on the right. A compact "today flow" may appear above the split to show the day's overall sequence, but the main working view keeps Life and Build separate.

Each item should show a plain-language label and a simple category, such as Life, People, Idea, or Build.

### Quick Idea Capture

The dashboard includes a small Inbox input. It is not a full editor.

Purpose:

- capture a messy thought quickly;
- save it as an Inbox note;
- let the agent organize it later.

The original Inbox note is preserved. Agent output is written to separate project, issue, calendar, daily, or knowledge files, with links back to the original.

Ideas start in Inbox. The user should not have to decide whether a thought is an idea, task, project, issue, note, or schedule block before writing it. The agent classifies it during organization.

When an Inbox Note is processed, preserve the original body. The agent may add frontmatter metadata and a short output-link section only:

```md
---
type: inbox
processed: true
processed_at: 2026-06-27T07:30:00+09:00
agent_run: .AgentRuns/2026-06-27-0730-organize-inbox.md
---

# Original note

Original user text stays here.

## Organized into
- [[Tasks/send-materials-to-minji]]
- [[Projects/june-lecture]]
- [[Calendar/2026/06/2026-06-29]]
```

If the user opens or selects an already processed Inbox Note, do not run `Organize Inbox` again by default. Show an `Already organized` state with:

- `View receipt`
- `Undo run`
- `Re-run organize`

`Re-run organize` must be an explicit user action. It creates a new Run Log and should read the existing `agent_run` and `Organized into` links to avoid duplicate Tasks, Issues, and Projects. If the app cannot confidently match an existing output, put the uncertain item in Needs approval instead of silently creating a duplicate.

`Re-run organize` may safely add missing source links, backlinks, or bookkeeping metadata to connect existing outputs back to the Inbox Note. It should not silently change existing Task, Issue, or Project body, title, status, due date, priority, or project assignment.

### Life / People Projects

This section is for projects where a person has to move, decide, attend, meet, teach, prepare, or follow up.

Examples:

- lecture preparation;
- meeting follow-up;
- workshop planning;
- personal errands;
- offline collaboration;
- relationship-driven work.

These projects should not look like code issues. They should show next actions, schedule, and related notes.

The default Life project view is Timeline + Next Actions. It emphasizes meetings, lectures, preparation, follow-ups, people, places, and materials.

Life projects do not use Issues in the MVP. Even when Life work becomes complex, it should be represented with Tasks, Schedule Blocks, and linked notes.

### Build Projects

This section is for app, web, service, and product-building work.

It can borrow Linear-like concepts, but stay solo-friendly:

- project;
- issue;
- status;
- priority;
- milestone;
- release note;
- linked note.

MVP excludes team concepts such as assignee, comments, cycles, workspace permissions, and roadmaps.

The default Build project view is an Issue List. A board view may exist later as a secondary view, but the first view should prioritize status, priority, due date, linked project, linked note, and next action.

## Tasks, Issues, and Ideas

Tasks and issues are separate concepts.

Task:

- a quick personal or daily action;
- completed with a checkbox;
- common in Today, Daily, and Life workflows.
- may be a lightweight Checklist Item or a Managed Task with its own metadata.

Managed Task:

- a Task with its own Markdown file and frontmatter;
- preferred for Today Dashboard, Agent Runs, Undo Plans, due dates, project links, and follow-up context.
- uses only `todo` and `done` status in the MVP.
- may use `important: true`, but does not use Issue-style priority.

Checklist Item:

- a lightweight Markdown checkbox inside a Daily, Project, or note body;
- remains part of Kuku's normal Markdown experience;
- may be promoted into a Managed Task by the agent when it needs metadata or dashboard tracking.

Issue:

- a structured unit of build work;
- has status such as backlog, todo, doing, or done;
- can have priority, due date, linked project, and linked notes;
- uses `low`, `medium`, or `high` priority only;
- belongs to Build workflows only in the MVP.
- may be marked blocked, but blocked is not a status value.

Follow-up:

- a next action that comes from a meeting, lecture, conversation, or real-world interaction;
- belongs to Life workflows;
- is stored as a Task with follow-up context, not as a separate file type.

Schedule Block:

- a local time block with a fixed start and end time;
- appears in Today flow, Life timelines, project timelines, and Weekly Planning;
- is not an external calendar event in the MVP.

Planning Candidate:

- a suggested work item that should be placed on the calendar later;
- does not yet have a fixed start and end time;
- may become a Schedule Block after the user or agent assigns a time range.

Idea:

- starts as Inbox content;
- may become a note, task, project, issue, Planning Candidate, or Schedule Block after organization.

The dashboard may show tasks, follow-ups, and issues together when they affect today, but Life pages should not expose issue language and Build pages should remain issue-centered. A follow-up is a Task in the data model, even if the UI labels it as a follow-up.

## Notes in the Dashboard

The dashboard should expose notes as context, not as long reading surfaces.

Show:

- related note titles;
- short previews;
- recent notes tied to today's work;
- meeting notes, lecture notes, decisions, and knowledge links.

Do not make the dashboard the primary long-form editor, graph view, or full vault browser. Those remain existing Kuku surfaces.

## Data Model

Markdown vault remains the source of truth. Indexes or SQLite tables may be used as cache only.

Recommended file structure:

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

Starter Workspace is the default onboarding path. It creates the recommended folders above. Opening an existing Markdown folder remains available, and the app can offer to create only the missing folders.

Projects use one shared model with a project type:

```md
---
type: project
project_type: life
status: active
---

# Lecture preparation
```

```md
---
type: project
project_type: build
status: active
---

# AI operating dashboard
```

Each project has exactly one primary `project_type`: `life` or `build`. Do not add a hybrid value such as `life_build` in the MVP. If work crosses both lanes, create or select the primary project and link to the related project in the other lane.

Example:

```md
---
type: project
project_type: life
related_projects:
  - AI operating dashboard
---

# AI app launch lecture
```

Managed Tasks use Markdown with frontmatter:

```md
---
type: task
status: todo
important: true
project: June Lecture
due: 2026-06-29
source_note: Meetings/2026-06-27-partner-meeting.md
---

# Send materials to Minji
```

Checklist Items stay inline:

```md
- [ ] Send materials to Minji
```

They can stay lightweight unless the user or agent needs dashboard tracking.

Issues use Markdown with frontmatter:

```md
---
type: issue
status: doing
project: AI operating dashboard
priority: high
due: 2026-06-30
blocked: false
---

# Finalize Today dashboard UX
```

Managed Tasks use `todo | done` only. Issues use `backlog | todo | doing | done`. Do not give Life tasks Issue-style workflow states in the MVP.

Managed Tasks use `important: true` for emphasis. Issues use `priority`. Do not give Life tasks Issue-style priority values in the MVP.

Issue priority uses `low | medium | high` only. Do not use `urgent`, `P0`, `P1`, or incident-style priority labels in the MVP.

Blocked Issues keep their original status and add blocked context:

```md
---
type: issue
status: doing
blocked: true
blocked_reason: "Waiting for API contract decision"
---
```

Do not use `status: blocked`.

Follow-ups use the Task file shape:

```md
---
type: task
task_type: follow_up
source_note: Meetings/2026-06-27-partner-meeting.md
project: June Lecture
due: 2026-06-29
---

# Send materials to Minji
```

Schedule Blocks use local Markdown first. External calendar sync is excluded from MVP.

Calendar is not a dominant standalone app in the MVP. It appears through Today flow, Life project timelines, project due dates, and Weekly Planning. A Calendar folder and list view can exist, but Google Calendar and Apple Calendar sync are excluded.

Do not treat unscheduled time suggestions as Schedule Blocks. Agent suggestions such as "spend two hours on dashboard design this week" are Planning Candidates until a fixed time range is chosen.

Detail pages use a friendly metadata header above the existing Kuku Markdown body. Project, issue, and task details should expose relevant fields such as status, due date, project, issue priority, task importance, linked notes, and agent actions without replacing the Markdown source.

## Agent Behavior

The agent is action-centered, not chat-centered.

Primary MVP agent action: `Organize Inbox`.

```text
Inbox note
-> Organize Inbox
-> project / issue / Planning Candidate / Schedule Block / knowledge links
-> safe auto-apply or approval request
-> Today dashboard updates
```

Codex CLI, when added, should be used for heavier agent work:

- Inbox organization;
- multi-file planning;
- weekly planning;
- project and issue structuring;
- decision extraction.

For the first MVP, implement `Organize Inbox` as the only fully working agent action. Weekly Planning drafts, selected-note organization, project restructuring, and multi-file planning can appear as later actions or disabled placeholders, but they should not be required to prove the MVP.

Each `Organize Inbox` run processes exactly one Inbox Note in the first MVP. Do not implement batch organize. One run should have one `source_note`, one Change Receipt, one Run Log, and one Undo Plan. If multiple Inbox Notes are selected, ask the user to choose one or show the batch action as unavailable.

`Organize Inbox` may create a new Life Project or Build Project as a Safe Auto Change only when the Inbox Note clearly describes project intent, such as preparing a lecture series or launching an app. If the project intent is ambiguous, do not create a project automatically. Create a Planning Candidate, Task, Issue, or note link instead.

Changing an existing Project in a meaningful way, including large description edits or bulk status changes, remains Approval Required.

Codex CLI is the primary MVP agent path. OpenAI API BYOK is the secondary path: the user enters their own OpenAI API key, stored only in macOS Keychain. The app should not store API keys in the vault, config files, localStorage, or agent logs.

Agent provider selection is automatic in the MVP:

1. Use Codex CLI when it is installed and appears authenticated.
2. Use OpenAI API BYOK when Codex CLI is not ready and an OpenAI API key is configured.
3. Show Agent Setup Required when neither provider is ready.

Settings should show provider status, such as Codex CLI connected, OpenAI API key added, or setup required. Do not add manual provider switching in the MVP.

Codex CLI setup is detection and guidance only in the MVP. The app should detect whether `codex` is installed and appears authenticated, then guide the user to complete Codex CLI login outside the app. Do not auto-install Codex CLI or manage Codex account login inside the app.

Codex Readiness Check should stay shallow:

- verify that the `codex` executable is available;
- run only a simple non-mutating auth/status check;
- treat command failure, timeout, missing executable, or logged-out status as not ready;
- do not read Codex token files, account details, credential stores, or private auth material;
- show Codex Setup Guidance instead of exposing raw internal errors.

Readiness failures should use simple user-facing statuses:

- `Codex CLI not found`
- `Login required`
- `Check timed out`

Do not store detailed stderr, command logs, or readiness diagnostics in the vault, Run Log, or agent logs. If diagnostic detail is useful, expose it only through a user-triggered `Copy diagnostic` action.

`Copy diagnostic` should include only safe minimal fields:

- app version;
- macOS version;
- provider status;
- readiness status;
- check name;
- exit code or timeout flag;
- timestamp.

`Copy diagnostic` must exclude:

- tokens;
- environment variables;
- full stdout or stderr;
- vault path;
- user file paths;
- user note content.

If the user has OpenAI API BYOK configured but Codex CLI is not configured, Agent Runs may execute directly with `provider: openai_api`. Do not call this fallback in the UI or Run Log. Fallback means a user-approved retry after Codex CLI cannot run.

When the user adds an OpenAI API key, show a clear setup cost notice:

```text
OpenAI API key로 Agent를 실행합니다.
API 사용량에 따라 비용이 발생할 수 있습니다.
```

After setup, direct OpenAI API runs should not show a blocking cost modal every time. Keep a lightweight provider indicator visible near agent actions, such as `OpenAI API 사용`.

If neither Codex CLI nor OpenAI API BYOK is ready, the app should still open normally. Kuku notes, search, graph, dashboard reading, manual tasks, and manual issues remain available. Agent actions such as Organize Inbox should become setup CTAs instead of running.

Example UI:

```text
Agent setup required

[Connect Codex CLI] [Add OpenAI API key]
```

OpenAI API fallback is manual in the MVP. If Codex CLI is missing, logged out, times out, or returns invalid output, the app should ask before retrying with OpenAI API every time fallback is used.

Example UI:

```text
Codex CLI로 실행하지 못했습니다. OpenAI API key로 다시 시도할까요?

[Retry with OpenAI API] [Open Codex setup]
```

Do not silently fall back to OpenAI API because it may incur user-visible API cost.

Every Agent Run should record which agent provider produced the Agent Plan. Use simple provider values such as `codex_cli` and `openai_api`. If OpenAI API was used as fallback, also record the fallback reason and approval timestamp. Do not store credentials, auth tokens, full prompts, or full model responses.

Codex CLI should generate an Agent Plan, not directly modify vault files. The Mac app validates the plan and applies it through Kuku's native runtime.

Codex CLI and OpenAI API must return a structured Agent Plan. Natural-language output may explain the plan to the user, but the app must not parse natural language to decide what to apply.

The Agent Plan is domain-level, not a low-level file patch. The app converts the Agent Plan into Markdown files and Kuku mutation operations.

Example Agent Plan:

```json
{
  "summary": "Created lecture follow-up tasks and one build issue.",
  "creates": [
    {
      "kind": "managed_task",
      "title": "Send materials to Minji",
      "source_note": "Meetings/2026-06-27-partner-meeting.md",
      "project": "June Lecture",
      "important": true,
      "due": "2026-06-29"
    },
    {
      "kind": "build_issue",
      "title": "Finalize Today dashboard MVP",
      "project": "AI operating dashboard",
      "status": "todo",
      "priority": "high"
    }
  ],
  "updates": [
    {
      "kind": "mark_inbox_processed",
      "source_note": "Inbox/2026-06-27-raw.md"
    }
  ],
  "approvalRequired": []
}
```

The app validates the Agent Plan, maps domain objects to vault paths and Markdown frontmatter, separates Safe Auto Changes from Approval-Required Changes, writes the Run Log, builds the Undo Plan, and applies changes through Kuku's native mutation path.

Example mapping:

```text
managed_task
-> Tasks/send-materials-to-minji.md
-> Kuku MutationPlan CreateFile
```

If Agent Plan validation fails, do not partially apply valid-looking items. Hold the whole run, show a Change Receipt state such as "Plan needs review", and write a failed Run Log with `status: failed_validation`.

Example:

```text
Agent Plan contains:
- 3 valid managed tasks
- 1 invalid issue

Result:
- no vault changes applied
- Run Log status: failed_validation
- user can retry or review the plan
```

Failed Run Logs should store validation error summaries, not the full invalid Agent Plan:

```md
## Validation Errors
- creates[3].priority must be one of low, medium, high
- updates[0].source_note is missing
```

Do not store the full invalid Agent Plan JSON, full model response, or prompt/context in the Run Log.

Kuku's native runtime remains responsible for:

- reading and writing vault files;
- checksum checks;
- path guards;
- mutation approval;
- safe auto-apply rules;
- run logs;
- undo plans.

## Auto Mode

Auto mode is included, but only for safe changes.

Auto mode means "safe changes may be applied without an approval click." It does not mean the agent runs in the background. In the first MVP, the agent only runs after an explicit user action such as Organize Inbox.

Safe auto changes:

- create clearly implied Life Projects or Build Projects;
- create Managed Tasks;
- create Issues;
- create Planning Candidates;
- create local Schedule Blocks;
- create Run Logs;
- add Today items;
- add source links to the original Inbox Note;
- mark the original Inbox Note as processed;
- add a short `Organized into` link section to the original Inbox Note;
- add small tags or backlinks;
- create daily or weekly review drafts;
- write the Undo Plan for the run.

Approval required:

- deleting files;
- renaming or moving files;
- replacing large note bodies;
- changing existing Task, Issue, or Project body, title, status, due date, priority, or assignment;
- bulk project status changes;
- meaningful edits to existing note content;
- external service sync;
- destructive calendar changes.

Safe Auto Changes should apply without a pre-apply review screen after the user starts the Agent Run. The app shows the Change Receipt after applying them.

Approval-Required Changes must pause before applying and show an Approval Review. The review should summarize only the risky changes, with actions such as approve, skip, or cancel run. Do not show a full review screen for safe-only runs in the MVP.

Every auto run must create a run log and undo plan in `.AgentRuns`.

Run Logs are minimal Markdown work receipts, not debugging transcripts. They should include only the information needed for user trust and whole-run undo.

Example:

```md
---
type: agent_run
started_at: 2026-06-27T07:30:00+09:00
mode: organize_inbox
source_note: Inbox/2026-06-27-raw.md
provider: codex_cli
status: applied
---

## Created
- Tasks/send-materials-to-minji.md
- Issues/dashboard-mvp.md

## Updated
- Inbox/2026-06-27-raw.md

## Approval Required
- none

## Undo
- delete if unchanged: Tasks/send-materials-to-minji.md
- remove processed metadata: Inbox/2026-06-27-raw.md
```

Run Logs must not include full prompts, full model responses, reasoning traces, token logs, API keys, Codex auth tokens, or OpenAI auth material.

If OpenAI API fallback is used, the Run Log should still be minimal:

```yaml
provider: openai_api
fallback_from: codex_cli
fallback_reason: codex_cli_timeout
fallback_approved_at: 2026-06-27T07:28:00+09:00
```

Every agent run should end with a non-developer-friendly change receipt:

- Created Tasks
- Created Issues
- Suggested Schedule
- New or Linked Projects
- Needs approval
- Undo

The Change Receipt should stay quiet about the provider when Codex CLI succeeds. If OpenAI API fallback was used, show a small plain-language note so the user understands that the API key path was used after approval:

```text
OpenAI API로 재시도됨
사용자 승인 후 Codex CLI 대신 OpenAI API로 이 정리를 완료했습니다.
```

This receipt is more important than showing a raw developer diff.

For `Organize Inbox`, the primary result view should show how the user's work changed before showing files. File paths and low-level created/updated file lists should live in a collapsed details area, not the main receipt.

Undo is whole-run only in the MVP. `Undo this run` reverses the Agent Run as a unit:

- deletes files created by the run when safe;
- removes `processed` metadata and the `Organized into` section from the source Inbox Note;
- removes small tags, backlinks, or source links added by the run;
- leaves unrelated user edits alone.

Undo must not overwrite user edits made after the Agent Run. If a target file changed after the run, mark that file as an Undo Conflict and skip automatic reversal for that file.

Example:

```text
Undo Result
- Reverted: Inbox processed metadata
- Reverted: added backlinks
- Conflict: Issues/dashboard-mvp.md was edited after the run
```

Use the same checksum-oriented safety model as Kuku's mutation flow: revert only when the file still matches the expected post-run state.

Do not build per-item undo in the MVP.

## Weekly Planning

Weekly Planning is included as a small MVP surface.

It should show:

- this week's Life work;
- this week's Build work;
- active issues;
- blocked items;
- unfinished items to reschedule;
- agent actions for making a weekly plan draft.

It should not include complex weekly calendar controls, team capacity, time tracking, or analytics in the MVP.

## Platform and Onboarding

The MVP is Mac app only.

Onboarding defaults to Starter Workspace creation:

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

Users can also open an existing Kuku or Obsidian-style Markdown folder. In that case, the app should preserve existing notes and offer to add missing operating folders.

First-run IA should guide the user into Codex setup early:

1. Create Starter Workspace or open an existing Markdown folder.
2. Check Codex CLI install/auth status.
3. If Codex CLI is ready, continue to Today Dashboard with agent actions enabled.
4. If Codex CLI is missing or logged out, show Codex Setup Guidance with an Open Codex setup action.
5. Let the user continue to the dashboard without completing setup, but keep agent actions as setup CTAs until a provider is ready.

In this setup state, `Open Codex setup` is the primary CTA. `Check again` and `Continue without agent` are secondary actions. Do not hide `Continue without agent`.

Example setup state:

```text
Codex CLI 연결이 필요합니다

터미널에서 Codex CLI 로그인을 완료한 뒤 다시 확인하세요.

[Open Codex setup] [Check again] [Continue without agent]
```

## Kuku Feature Preservation

The fork should preserve Kuku's existing core surfaces:

- Markdown vault;
- editor;
- wikilinks;
- backlinks;
- search;
- graph views;
- existing AI chat;
- local-first file ownership;
- encrypted sync foundation where upstream supports it.

The dashboard is an added first-class surface, not a replacement for notes.

## MVP Scope

Included:

- Mac app only;
- Starter Workspace onboarding;
- Kuku-style Today dashboard;
- Life-left / Build-right project lanes;
- quick Inbox capture;
- Task and Issue distinction;
- Managed Task and Checklist Item distinction;
- Markdown frontmatter models for projects and issues;
- local schedule blocks;
- small Weekly Planning surface;
- `Organize Inbox` as the first fully working agent action;
- Codex CLI primary agent path;
- OpenAI API BYOK as secondary provider or approved fallback;
- macOS Keychain storage for OpenAI API keys;
- agent action panel;
- safe auto-apply policy;
- agent run log and undo plan;
- Kuku note features preserved.

Excluded:

- Google Calendar sync;
- Apple Calendar sync;
- Linear API sync;
- Notion API sync;
- Slack or Gmail integration;
- team collaboration;
- assignees;
- comments;
- sprints and cycles;
- public SaaS backend;
- mobile or iOS companion;
- background auto-organization.

## Acceptance Criteria

The design is successful when a non-developer can open the app and understand:

- what they need to do today;
- which items are life or people work;
- which items are app, web, or service-building work;
- where to capture a new idea;
- what the agent is proposing;
- which changes are safe auto-applied and which require approval;
- how to return to normal Kuku notes, search, graph, and editor.

The first useful moment should be:

```text
Write or paste one Inbox note
-> click Organize Inbox
-> see work outcomes first: tasks, issues, projects, Planning Candidates, Schedule Blocks, and related notes
-> safe changes apply automatically
-> risky changes ask for approval
-> review the change receipt or undo the run
```

## Visual Reference From Brainstorming

The approved mockup direction is stored in the local brainstorming session:

```text
../../../../.superpowers/brainstorm/29645-1782509390/content/dashboard-kuku-style-a.html
```

It is a directional mockup only. It is not implementation code.
