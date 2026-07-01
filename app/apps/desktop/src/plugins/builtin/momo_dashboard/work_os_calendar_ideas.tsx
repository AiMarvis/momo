import { For, Show, createMemo, createSignal } from "solid-js";

import { PlusIcon } from "~/components/icons";

import {
  createWorkIdea,
  deleteWorkIdea,
  workOsState,
  type WorkItem,
  type WorkProject,
} from "./work_os_store";
import { BUTTON_CLASS, EmptyRow, INPUT_CLASS, SectionHeader } from "./work_os_dashboard_parts";

type CalendarEntryKind = "Task" | "Project";

interface CalendarEntry {
  readonly id: string;
  readonly kind: CalendarEntryKind;
  readonly title: string;
  readonly date: string;
  readonly detail: string;
}

interface CalendarGroup {
  readonly date: string;
  readonly entries: readonly CalendarEntry[];
}

function CalendarSection() {
  const calendarGroups = createMemo(() => groupCalendarEntries());

  return (
    <section class="rounded-xs border border-border bg-bg-secondary/70 p-4">
      <SectionHeader title="Calendar" detail="Tasks and projects by date" />
      <div class="mt-3 grid gap-2">
        <Show when={calendarGroups().length > 0} fallback={<EmptyRow label="No scheduled work yet" />}>
          <For each={calendarGroups()}>
            {(group) => (
              <section class="rounded-xs border border-border bg-bg-primary p-2.5">
                <p class="text-[0.75rem] font-semibold text-text-secondary">{group.date}</p>
                <div class="mt-2 grid gap-1.5">
                  <For each={group.entries}>
                    {(entry) => (
                      <article class="grid gap-1 rounded-xs border border-border bg-bg-secondary/70 px-2 py-1.5">
                        <div class="flex min-w-0 items-center justify-between gap-2">
                          <p class="truncate text-sm font-medium text-text-primary">{entry.title}</p>
                          <span class="shrink-0 text-[0.6875rem] text-text-muted">
                            {entry.kind}
                          </span>
                        </div>
                        <p class="truncate text-[0.75rem] text-text-muted">{entry.detail}</p>
                      </article>
                    )}
                  </For>
                </div>
              </section>
            )}
          </For>
        </Show>
      </div>
    </section>
  );
}

function IdeaSection() {
  const [ideaText, setIdeaText] = createSignal("");

  function submitIdea(event: SubmitEvent): void {
    event.preventDefault();
    if (!ideaText().trim()) return;
    createWorkIdea(ideaText());
    setIdeaText("");
  }

  return (
    <section class="rounded-xs border border-border bg-bg-secondary/70 p-4">
      <SectionHeader title="Ideas" detail="Short notes for brainstorming" />
      <form class="mt-3 grid gap-2" onSubmit={submitIdea}>
        <textarea
          class={`${INPUT_CLASS} min-h-20 resize-none`}
          aria-label="Idea"
          value={ideaText()}
          placeholder="Quick idea"
          onInput={(event) => setIdeaText(event.currentTarget.value)}
        />
        <button type="submit" class={BUTTON_CLASS}>
          <PlusIcon size={14} />
          <span>Create idea</span>
        </button>
      </form>
      <div class="mt-3 grid gap-2">
        <Show when={workOsState.ideas.length > 0} fallback={<EmptyRow label="No ideas yet" />}>
          <For each={workOsState.ideas}>
            {(idea) => (
              <article class="rounded-xs border border-warning-border bg-warning-bg/30 p-2.5">
                <p class="whitespace-pre-wrap text-sm text-text-primary">{idea.text}</p>
                <button
                  type="button"
                  class="mt-2 rounded-xs border border-border bg-bg-primary px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-ghost-hover hover:text-text-primary"
                  onClick={() => deleteWorkIdea(idea.id)}
                >
                  Delete
                </button>
              </article>
            )}
          </For>
        </Show>
      </div>
    </section>
  );
}

function groupCalendarEntries(): CalendarGroup[] {
  const entries = [
    ...workOsState.tasks.flatMap((task) => compactTaskCalendarEntry(task)),
    ...workOsState.projects.flatMap((project) => compactProjectCalendarEntry(project)),
  ].sort(
    (left, right) =>
      left.date.localeCompare(right.date) ||
      left.kind.localeCompare(right.kind) ||
      left.title.localeCompare(right.title),
  );
  const groups = new Map<string, CalendarEntry[]>();
  for (const entry of entries) {
    groups.set(entry.date, [...(groups.get(entry.date) ?? []), entry]);
  }
  return [...groups].map(([date, groupEntries]) => ({ date, entries: groupEntries }));
}

function compactTaskCalendarEntry(task: WorkItem): CalendarEntry[] {
  if (!task.scheduleDate) return [];
  return [
    {
      id: task.id,
      kind: "Task",
      title: task.title,
      date: task.scheduleDate,
      detail: projectNameFor(task.projectId),
    },
  ];
}

function compactProjectCalendarEntry(project: WorkProject): CalendarEntry[] {
  if (!project.scheduleDate) return [];
  return [
    {
      id: project.id,
      kind: "Project",
      title: project.name,
      date: project.scheduleDate,
      detail: project.status,
    },
  ];
}

function projectNameFor(projectId: string | null): string {
  if (!projectId) return "No project";
  return workOsState.projects.find((project) => project.id === projectId)?.name ?? "Missing project";
}

export { CalendarSection, IdeaSection };
