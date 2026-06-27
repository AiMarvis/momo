# Kuku OS

Kuku OS is a local-first Mac workspace for solo builders. It keeps Kuku's Markdown knowledge workspace intact while adding a friendly operating dashboard for life work, build work, and AI-assisted organization.

## Language

**Kuku OS**:
The current codename for the Kuku fork product.
_Avoid_: Released brand

**Vault**:
The user's local Markdown folder that remains the source of truth.
_Avoid_: Database, workspace database

**Starter Workspace**:
A new vault initialized with the recommended operating folders.
_Avoid_: Template project, sample vault

**Today Dashboard**:
The first screen that shows today's Life work, Build work, quick capture, and agent suggestions.
_Avoid_: Homepage, notes dashboard

**Life Project**:
A project centered on people, meetings, lectures, personal errands, offline work, or real-world follow-up.
_Avoid_: Personal issue, non-technical project

**Build Project**:
A project centered on creating an app, web product, service, launch, release, or software-like deliverable.
_Avoid_: Technical task list, dev board

**Task**:
A user-facing action that can be completed directly.
_Avoid_: Issue, ticket

**Managed Task**:
A Task with its own Markdown file and metadata, used by the Today Dashboard and Agent Runs.
_Avoid_: Issue, ticket

**Important Task**:
A Managed Task marked as important without using an Issue-style priority scale.
_Avoid_: Priority, P0, P1

**Checklist Item**:
A lightweight Markdown checkbox inside a note.
_Avoid_: Managed Task, Issue

**Issue**:
A structured unit of Build work with status, priority, due date, project, and linked notes when needed.
_Avoid_: Task, ticket

**Issue Priority**:
The `low`, `medium`, or `high` priority field used only for Issues in Build workflows.
_Avoid_: Task importance

**Blocked Issue**:
An Issue that cannot move forward until an external dependency, decision, or missing input is resolved.
_Avoid_: Blocked status

**Follow-up**:
A Task whose source is a meeting, lecture, conversation, or real-world interaction.
_Avoid_: Issue, ticket

**Idea**:
An unclassified thought captured before the user knows whether it should become a note, task, issue, project, Planning Candidate, or Schedule Block.
_Avoid_: Feature request, note draft

**Inbox Note**:
The preserved source note where an idea, meeting note, or messy thought first enters the system.
_Avoid_: Scratchpad, temporary note

**Processed Inbox Note**:
An Inbox Note that keeps its original body and adds processing metadata plus links to created outputs.
_Avoid_: Rewritten source note, deleted inbox item

**Organize Re-run**:
An explicit second Organize Inbox run on a Processed Inbox Note.
_Avoid_: Silent duplicate organization

**Schedule Block**:
A local planned time block linked to work in the vault.
_Avoid_: Calendar event, external calendar event

**Planning Candidate**:
A suggested work item that should be scheduled later but does not yet have a fixed time range.
_Avoid_: Schedule Block, event

**Weekly Planning**:
A small planning surface that reviews Life and Build work for the week.
_Avoid_: Calendar app, sprint planning

**Agent Run**:
A user-triggered AI organization pass over selected context.
_Avoid_: Background sync, automation job

**Organize Inbox**:
The first MVP Agent Run that turns one messy Inbox Note into structured work and links.
_Avoid_: General agent mode, batch cleanup, full workspace cleanup

**Agent Plan**:
A structured, app-validated domain plan returned by an AI provider for an Agent Run.
_Avoid_: Chat reply, natural-language-only result, file patch

**Agent Provider**:
The execution path that produces an Agent Plan for an Agent Run.
_Avoid_: Model name, API key

**Agent Provider Selection**:
The automatic choice of which Agent Provider to use for an Agent Run.
_Avoid_: Manual model picker

**Agent Setup Required**:
A state where no usable Agent Provider is configured, while the Vault and dashboard remain available.
_Avoid_: App locked, setup wall

**Codex Setup Guidance**:
A first-run and Settings flow that detects Codex CLI install/auth status and guides the user to finish Codex login outside the app.
_Avoid_: Automatic install, in-app Codex account management

**Codex Readiness Check**:
A shallow check that Codex CLI appears installed and authenticated enough to run Agent work.
_Avoid_: Token inspection, account audit

**Codex Diagnostic Copy**:
A user-triggered safe summary of a Codex Readiness Check failure.
_Avoid_: Raw log dump, credential export

**Invalid Agent Plan**:
An Agent Plan that fails validation and must not be applied.
_Avoid_: Partial apply

**Agent Provider Fallback**:
A user-approved retry of an Agent Run through OpenAI API when Codex CLI cannot run.
_Avoid_: Silent fallback, automatic API retry

**Safe Auto Change**:
A low-risk agent change that may be applied without an approval click after the user explicitly starts an Agent Run, including new operating files and small metadata or link updates.
_Avoid_: Full auto mode, background automation

**Approval-Required Change**:
A risky agent change that needs the user to approve it before the app applies it.
_Avoid_: Manual task

**Approval Review**:
A pre-apply screen shown only for Approval-Required Changes.
_Avoid_: Mandatory review for every Agent Run

**Change Receipt**:
A non-developer-friendly summary of what an Agent Run created, updated, held for approval, and can undo.
_Avoid_: Diff, patch report

**Run Log**:
A minimal Markdown work receipt for an Agent Run, used for trust and whole-run undo.
_Avoid_: Audit table, prompt log, model transcript

**Undo Plan**:
The recorded whole-run steps needed to reverse an Agent Run in the MVP.
_Avoid_: Backup, version history, per-item undo

**Undo Conflict**:
A file that cannot be safely reverted because it changed after the Agent Run.
_Avoid_: Forced undo, overwrite

## Relationships

- A **Vault** can be created as a **Starter Workspace** or opened from an existing Markdown folder.
- A **Today Dashboard** shows **Life Projects** on the left and **Build Projects** on the right.
- A **Life Project** and a **Build Project** are both projects, but they are separated in the UI.
- A project has exactly one primary type: **Life Project** or **Build Project**.
- Cross-boundary work is represented by links between projects, not by a hybrid project type.
- A **Life Project** uses **Tasks**, **Schedule Blocks**, and linked notes instead of **Issues**.
- A **Follow-up** is represented as a **Task**, not as a separate file type.
- A **Managed Task** is lighter than an **Issue** but more structured than a **Checklist Item**.
- A **Managed Task** uses only `todo` and `done` status.
- A **Managed Task** may be an **Important Task**, but it does not use **Issue Priority**.
- A **Checklist Item** may be promoted into a **Managed Task** by an **Agent Run**.
- An **Issue** usually belongs to one **Build Project**.
- An **Issue** can use `backlog`, `todo`, `doing`, and `done` status.
- An **Issue** may have **Issue Priority**: `low`, `medium`, or `high`.
- A **Blocked Issue** keeps its original Issue status and adds blocked context.
- An **Idea** usually starts inside an **Inbox Note**.
- An AI provider returns an **Agent Plan** before the app applies an **Agent Run**.
- An **Agent Run** has one **Agent Provider**, such as Codex CLI or OpenAI API.
- **Agent Provider Selection** is automatic in the MVP.
- OpenAI API can be a direct **Agent Provider** when it is the only configured provider.
- Settings shows **Agent Provider** status but does not provide manual provider switching in the MVP.
- **Agent Setup Required** blocks **Agent Runs**, not the **Vault**, notes, or dashboard.
- **Codex Setup Guidance** appears during first-run onboarding before the user reaches the main dashboard.
- **Codex Setup Guidance** detects and guides but does not install Codex CLI or manage Codex login inside the app.
- **Codex Setup Guidance** offers setup as the primary action and continuing without an agent as a secondary action.
- A **Codex Readiness Check** only verifies executable availability and apparent auth readiness.
- A **Codex Readiness Check** must not read Codex tokens, account details, or credential files.
- A failed **Codex Readiness Check** shows a simple user-facing status, not raw stderr or logs.
- Detailed **Codex Readiness Check** diagnostics are not stored in the **Vault** or **Run Log**.
- A **Codex Diagnostic Copy** includes only safe environment and readiness metadata.
- A **Codex Diagnostic Copy** excludes tokens, environment variables, raw stdout/stderr, vault paths, user file paths, and note content.
- Direct OpenAI API runs do not need per-run approval after setup, but the UI should keep a lightweight provider indicator visible.
- An **Agent Plan** may include a human-readable summary, but its actionable changes must be structured.
- An **Agent Plan** describes domain outputs such as **Managed Tasks**, **Issues**, **Planning Candidates**, and **Schedule Blocks**.
- The app converts an **Agent Plan** into Kuku file mutations before applying changes.
- A **Run Log** records the **Agent Provider** and fallback reason when fallback is used.
- A **Change Receipt** shows **Agent Provider Fallback** only when fallback was used.
- A **Change Receipt** leads with work outcomes, not file paths.
- File paths in a **Change Receipt** belong in details, not the primary result view.
- **Agent Provider Fallback** is never automatic in the MVP.
- **Agent Provider Fallback** requires explicit user approval each time because it may use the user's OpenAI API key and incur API cost.
- An **Invalid Agent Plan** blocks the whole **Agent Run** from applying changes.
- An **Invalid Agent Plan** may produce a failed **Run Log** with validation error summaries, but no vault changes are applied.
- A failed **Run Log** does not store the full invalid **Agent Plan**.
- **Organize Inbox** is the first core MVP Agent Run.
- An **Agent Run** may turn an **Inbox Note** into a **Processed Inbox Note**.
- An **Agent Run** may turn an **Inbox Note** into **Managed Tasks**, **Issues**, **Schedule Blocks**, **Planning Candidates**, and linked notes.
- **Organize Inbox** processes one **Inbox Note** per **Agent Run** in the MVP.
- **Organize Inbox** starts from one **Inbox Note** and may create **Life Projects**, **Build Projects**, **Managed Tasks**, **Issues**, **Schedule Blocks**, **Planning Candidates**, and linked notes.
- **Organize Inbox** creates a new **Life Project** or **Build Project** only when the **Inbox Note** clearly describes a project.
- Ambiguous project-like **Inbox Notes** become **Planning Candidates**, **Tasks**, or **Issues** instead of new projects.
- A **Processed Inbox Note** links to the outputs created by its **Agent Run**.
- **Organize Inbox** does not run again by default on a **Processed Inbox Note**.
- A **Processed Inbox Note** shows an Already organized state with access to its receipt, undo, and **Organize Re-run**.
- An **Organize Re-run** creates a new **Run Log** and uses existing output links to avoid duplicate Tasks, Issues, and Projects.
- An **Organize Re-run** may add missing source links or bookkeeping metadata, but it does not silently change existing Task, Issue, or Project content or status.
- A **Planning Candidate** becomes a **Schedule Block** only after a fixed time range is chosen.
- An **Agent Run** can apply **Safe Auto Changes** and must ask before applying **Approval-Required Changes**.
- **Safe Auto Changes** do not require an **Approval Review** before applying.
- A **Safe Auto Change** can create new Life Projects, Build Projects, Managed Tasks, Issues, Planning Candidates, Schedule Blocks, Run Logs, and small links or tags.
- An **Approval-Required Change** includes deletion, rename, move, large body replacement, bulk project state changes, meaningful existing-note edits, and external service changes.
- Updating existing Task, Issue, or Project content, status, due date, priority, or assignment is an **Approval-Required Change**.
- An **Approval-Required Change** is shown in an **Approval Review** before the app applies it.
- Every **Agent Run** produces a **Change Receipt** and a **Run Log** with an **Undo Plan**.
- A **Run Log** records the source, mode, status, created files, updated files, approval-required changes, and undo steps.
- A **Run Log** does not record full prompts, full model responses, reasoning traces, token logs, API keys, or auth tokens.
- An **Undo Plan** reverses the whole **Agent Run** in the MVP, not individual created items.
- An **Undo Conflict** prevents automatic reversal for that file while allowing safe parts of the **Undo Plan** to continue.

## Example Dialogue

> **Dev:** "If a user writes a messy lecture idea in the Inbox, do we ask them whether it is a Task, Issue, or Project?"
> **Domain expert:** "No. It starts as an **Inbox Note**. **Organize Inbox** classifies it and may create a **Task**, **Life Project**, **Build Project**, **Schedule Block**, or note link when the intent is clear."

> **Dev:** "Can the agent update Today automatically in the background?"
> **Domain expert:** "No. A **Safe Auto Change** can be applied automatically only after the user explicitly starts an **Agent Run**."

## Flagged Ambiguities

- "Project" can mean both real-world work and software-building work. Resolved: use **Life Project** and **Build Project** in the UI, backed by one project model.
- "Hybrid project" could mean work that belongs to both Life and Build. Resolved: choose one primary project type and link to the related project in the other lane.
- "Create project" can imply creating a project for any project-like idea. Resolved: **Organize Inbox** creates a project only when the source clearly describes one; ambiguous items become lighter work objects.
- "Task" and "Issue" can both mean work to do. Resolved: **Task** is user-facing work, **Managed Task** is dashboard-managed work, and **Issue** is structured Build work only.
- "Task" can mean a Markdown checkbox or a dashboard-managed object. Resolved: use **Checklist Item** for inline Markdown checkboxes and **Managed Task** for task files with metadata.
- "Status" can mean simple completion or workflow state. Resolved: **Managed Task** uses `todo | done`; **Issue** uses `backlog | todo | doing | done`.
- "Blocked" can look like a workflow status. Resolved: **Blocked Issue** is an **Issue** with blocked context, not `status: blocked`.
- "Priority" can make Life work feel like Build work. Resolved: **Issue Priority** is for Issues only; **Managed Tasks** use important/not-important.
- "Priority" can use incident-style labels. Resolved: **Issue Priority** uses `low | medium | high`, not `P0`, `P1`, or `urgent`.
- "Issue" could have applied to complex Life work. Resolved: complex **Life Projects** use **Tasks**, **Schedule Blocks**, and linked notes instead.
- "Follow-up" could have been a separate work type. Resolved: **Follow-up** is a **Task** with follow-up context.
- "Auto" can mean automatic execution or automatic application. Resolved: **Safe Auto Change** means automatic application after explicit user action, not background execution.
- "Safe" can imply no files are written. Resolved: **Safe Auto Change** may create new operating files and small metadata/link updates, but not destructive or meaning-changing edits.
- "Review screen" can imply every Agent Run stops before applying. Resolved: only **Approval-Required Changes** use **Approval Review**; safe runs use a post-run **Change Receipt**.
- "Change Receipt" can imply a file diff or file list. Resolved: lead with user-facing work outcomes and keep file paths in details.
- "Agent action" can imply multiple first-release workflows. Resolved: **Organize Inbox** is the first core MVP Agent Run; other agent workflows come later.
- "Organize Inbox" can imply batch cleanup. Resolved: one **Organize Inbox** run processes one **Inbox Note** in the MVP.
- "Run Log" can imply a debugging transcript. Resolved: **Run Log** is a minimal work receipt, not a prompt/model transcript.
- "Agent result" can mean a natural-language answer. Resolved: AI providers must return an **Agent Plan** with structured actionable changes; natural language is only supporting explanation.
- "Agent Provider" can mean a model, account, or auth method. Resolved: **Agent Provider** means the execution path that produced the **Agent Plan**, not stored credentials.
- "Agent Provider Selection" can imply a user-facing provider picker. Resolved: **Agent Provider Selection** is automatic in the MVP.
- "Codex setup" can imply the app owns installation and login. Resolved: **Codex Setup Guidance** only detects and guides; the user completes CLI install/login outside the app.
- "Codex authenticated" can imply inspecting private auth material. Resolved: use a shallow **Codex Readiness Check** and send failures to setup guidance.
- "Codex diagnostic" can imply stored logs. Resolved: show simple readiness statuses and offer user-initiated diagnostic copy only.
- "Copy diagnostic" can imply copying everything the command emitted. Resolved: **Codex Diagnostic Copy** is a safe minimal summary, not raw command output.
- "Agent Plan" can mean low-level file patches. Resolved: **Agent Plan** is domain-level; the app translates it into Kuku file mutations.
- "OpenAI API" can mean direct provider or fallback provider. Resolved: it is direct when selected/configured as the current **Agent Provider**, and fallback only when retrying after Codex CLI cannot run.
- "Cost notice" can become repetitive. Resolved: direct OpenAI API use shows a clear setup notice and a lightweight active-provider indicator, while fallback retry asks every time.
- "Fallback" can imply silent automatic retry. Resolved: **Agent Provider Fallback** requires explicit user approval in the MVP.
- "Validation failure" can invite partial application. Resolved: an **Invalid Agent Plan** is not partially applied in the MVP.
- "Failed run logging" can invite storing full model output. Resolved: failed **Run Logs** store validation error summaries only, not the full invalid **Agent Plan**.
- "Processed" can imply the source note was rewritten or removed. Resolved: a **Processed Inbox Note** preserves the original body and only adds metadata plus output links.
- "Re-run organize" can imply silently duplicating outputs. Resolved: **Organize Re-run** is explicit and checks existing output links before creating new work objects.
- "Update existing output" can imply silent correction. Resolved: **Organize Re-run** may only add bookkeeping links automatically; meaningful output updates require approval.
- "Undo" can mean per-item reversal or whole-run reversal. Resolved: **Undo Plan** means whole-run undo in the MVP.
- "Undo" can imply overwriting later user edits. Resolved: changed files become **Undo Conflicts** and are not automatically reverted.
- "Calendar" can imply external calendar sync. Resolved: use **Schedule Block** for local planned time in the MVP.
- "Schedule" can mean a fixed time or a suggested future time. Resolved: use **Schedule Block** for fixed time ranges and **Planning Candidate** for unscheduled suggestions.
