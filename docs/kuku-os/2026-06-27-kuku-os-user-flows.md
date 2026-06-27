# Kuku OS MVP User Flows

Date: 2026-06-27
Status: Planning artifact for Kuku fork MVP

## Flow Principles

- First screen should answer: "What do I need to do today?"
- Life work and Build work are separated visually, but share the same Markdown vault.
- Ideas start as Inbox Notes. The user should not classify them before writing.
- Agent work starts only when the user explicitly clicks an action.
- Safe changes may apply automatically after the click. Risky changes pause for approval.
- Every Agent Run ends with a Change Receipt and can be undone as a whole run.

## First-Run IA

```mermaid
flowchart TD
  Start["Open Kuku OS"]
  Workspace{"Workspace choice"}
  Starter["Create Starter Workspace"]
  Existing["Open existing Markdown folder"]
  Folders["Create or confirm operating folders"]
  CodexCheck["Run Codex Readiness Check"]
  Ready{"Codex ready?"}
  Dashboard["Today Dashboard\nagent enabled"]
  Guidance["Codex Setup Guidance"]
  OpenSetup["Open Codex setup"]
  CheckAgain["Check again"]
  Continue["Continue without agent"]
  Limited["Today Dashboard\nagent actions become setup CTAs"]

  Start --> Workspace
  Workspace --> Starter
  Workspace --> Existing
  Starter --> Folders
  Existing --> Folders
  Folders --> CodexCheck
  CodexCheck --> Ready
  Ready -->|yes| Dashboard
  Ready -->|no| Guidance
  Guidance --> OpenSetup
  Guidance --> CheckAgain
  Guidance --> Continue
  CheckAgain --> CodexCheck
  Continue --> Limited
```

Primary CTA in setup is `Open Codex setup`. Secondary actions are `Check again` and `Continue without agent`. Continuing without an agent must not block notes, search, graph, manual tasks, manual issues, or dashboard reading.

![Codex setup mockup](../assets/kuku-os/kuku-os-codex-setup.png)

## Everyday Dashboard Flow

```mermaid
flowchart LR
  Open["Open app"]
  Today["Today Dashboard"]
  Life["Life lane\npersonal, meetings, lectures, people work"]
  Build["Build lane\napps, web, services, issues"]
  Capture["Quick Inbox capture"]
  Notes["Kuku notes, search, graph, editor"]
  Agent["Agent panel"]

  Open --> Today
  Today --> Life
  Today --> Build
  Today --> Capture
  Today --> Notes
  Today --> Agent
```

The Today Dashboard is not a marketing page and not a blank note. It is a working surface with clear lanes:

- Life lane: Tasks, Follow-ups, Schedule Blocks, related notes
- Build lane: Issues, Build Projects, due dates, blocked status, related notes
- Quick capture: writes to Inbox as a preserved source note
- Agent panel: offers Organize Inbox when one Inbox Note is selected

![Today dashboard mockup](../assets/kuku-os/kuku-os-today-dashboard.png)

## Organize Inbox Flow

```mermaid
flowchart TD
  Select["Select one Inbox Note"]
  Multi{"Multiple selected?"}
  Choose["Ask user to choose one\nbatch unavailable in MVP"]
  Processed{"Already processed?"}
  Already["Show Already organized\nView receipt, Undo run, Re-run organize"]
  Run["Click Organize Inbox"]
  Provider{"Provider ready?"}
  Setup["Show Agent Setup Required"]
  Plan["Provider returns structured Agent Plan"]
  Validate{"Plan valid?"}
  Fail["Write failed Run Log\nno vault changes"]
  Split["Separate Safe Auto and Approval Required"]
  ApplySafe["Apply Safe Auto Changes"]
  Risky{"Risky changes exist?"}
  Approval["Show Approval Review"]
  Receipt["Show Change Receipt\nwork outcomes first"]

  Select --> Multi
  Multi -->|yes| Choose
  Multi -->|no| Processed
  Processed -->|yes| Already
  Processed -->|no| Run
  Run --> Provider
  Provider -->|no| Setup
  Provider -->|yes| Plan
  Plan --> Validate
  Validate -->|no| Fail
  Validate -->|yes| Split
  Split --> ApplySafe
  ApplySafe --> Risky
  Risky -->|yes| Approval
  Risky -->|no| Receipt
  Approval --> Receipt
```

MVP rule: one Organize Inbox run processes exactly one Inbox Note. It creates one Run Log, one Change Receipt, and one Undo Plan.

![Organize Inbox flow mockup](../assets/kuku-os/kuku-os-organize-inbox-flow.png)

## Change Receipt Flow

The receipt leads with work outcomes:

1. Created Tasks
2. Created Issues
3. Suggested Schedule
4. New or Linked Projects
5. Needs approval
6. Undo

File paths and low-level mutations belong in collapsed details.

```mermaid
flowchart TD
  Receipt["Change Receipt"]
  Outcomes["Created Tasks, Issues, Schedule, Projects"]
  Details["Collapsed file details"]
  Undo["Undo run"]
  Rerun["Re-run organize"]

  Receipt --> Outcomes
  Receipt --> Details
  Receipt --> Undo
  Receipt --> Rerun
```

Provider is quiet when Codex succeeds. If OpenAI API fallback was used after user approval, the receipt shows a small note: `OpenAI API로 재시도됨`.

## Approval Review Flow

```mermaid
flowchart TD
  Plan["Validated Agent Plan"]
  Split["Risk split"]
  Safe["Safe Auto Changes"]
  Risky["Approval-Required Changes"]
  Apply["Apply safe changes"]
  Review["Approval Review"]
  Approve["Approve selected risky changes"]
  Skip["Skip risky changes"]
  Cancel["Cancel run before risky changes"]
  Receipt["Change Receipt"]

  Plan --> Split
  Split --> Safe
  Split --> Risky
  Safe --> Apply
  Risky --> Review
  Review --> Approve
  Review --> Skip
  Review --> Cancel
  Approve --> Receipt
  Skip --> Receipt
  Apply --> Receipt
```

Safe-only runs should not show a blocking pre-apply review. Review appears only when risky changes exist.

## Already Organized and Re-run Flow

```mermaid
flowchart TD
  Note["Open Processed Inbox Note"]
  State["Already organized state"]
  View["View receipt"]
  Undo["Undo run"]
  Rerun["Re-run organize"]
  ReadPrior["Read prior agent_run and Organized into links"]
  Deduplicate["Avoid duplicates"]
  MissingLinks["Add missing source links or backlinks as Safe Auto"]
  MeaningfulEdits["Meaningful changes to existing outputs"]
  Approval["Needs approval"]

  Note --> State
  State --> View
  State --> Undo
  State --> Rerun
  Rerun --> ReadPrior
  ReadPrior --> Deduplicate
  Deduplicate --> MissingLinks
  Deduplicate --> MeaningfulEdits
  MeaningfulEdits --> Approval
```

Re-run is explicit. It can safely add missing bookkeeping links, but cannot silently change existing task, issue, or project title, body, status, due date, priority, or assignment.

## Undo Flow

```mermaid
flowchart TD
  Click["Click Undo run"]
  Load["Load Run Log and Undo Plan"]
  Check["Checksum check"]
  Safe{"Target unchanged?"}
  Revert["Revert safe changes"]
  Conflict["Mark Undo Conflict"]
  Result["Show Undo Result"]

  Click --> Load
  Load --> Check
  Check --> Safe
  Safe -->|yes| Revert
  Safe -->|no| Conflict
  Revert --> Result
  Conflict --> Result
```

Undo is whole-run only in MVP. It deletes created files only if unchanged, removes processed metadata and organized links from the source Inbox Note, and skips files edited after the run.

## First Useful Moment

```text
Write or paste one Inbox note
-> click Organize Inbox
-> see work outcomes first
-> safe changes apply automatically
-> risky changes ask for approval
-> review the Change Receipt or undo the run
```
