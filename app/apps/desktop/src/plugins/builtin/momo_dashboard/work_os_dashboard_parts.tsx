import { For, Show } from "solid-js";

import {
  PROJECT_STATUSES,
  WORK_ITEM_STATUSES,
  WORK_PRIORITIES,
  updateWorkProjectStatus,
  workOsState,
  type WorkItem,
  type WorkItemStatus,
  type WorkPriority,
  type WorkProject,
  type WorkProjectStatus,
} from "./work_os_store";

const SELECT_CLASS =
  "rounded-xs border border-border bg-bg-primary px-2 py-1.5 text-xs text-text-secondary outline-none transition-colors focus:border-border-focused";
const INPUT_CLASS =
  "min-w-0 rounded-xs border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-border-focused";
const BUTTON_CLASS =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xs border border-border bg-bg-primary px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-ghost-hover hover:text-text-primary";

function Metric(props: { label: string; value: number }) {
  return (
    <div class="rounded-xs border border-border bg-bg-primary px-2 py-1.5">
      <p class="text-[0.6875rem] text-text-muted">{props.label}</p>
      <p class="mt-0.5 text-sm font-semibold text-text-primary">{props.value}</p>
    </div>
  );
}

function SectionHeader(props: { title: string; detail: string }) {
  return (
    <div>
      <h2 class="text-sm font-semibold text-text-primary">{props.title}</h2>
      <p class="mt-1 text-xs text-text-secondary">{props.detail}</p>
    </div>
  );
}

function WorkItemList(props: {
  items: readonly WorkItem[];
  emptyLabel: string;
  onPriority: (id: string, priority: WorkPriority) => void;
  onStatus: (id: string, status: WorkItemStatus) => void;
}) {
  return (
    <div class="mt-3 grid gap-1.5">
      <Show when={props.items.length > 0} fallback={<EmptyRow label={props.emptyLabel} />}>
        <For each={props.items}>
          {(item) => (
            <article class="grid gap-2 rounded-xs border border-border bg-bg-primary p-2.5 md:grid-cols-[minmax(0,1fr)_8rem_7rem]">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-text-primary">{item.title}</p>
                <p class="mt-1 truncate text-[0.75rem] text-text-muted">
                  {projectNameFor(item.projectId) ?? "No project"}
                  <Show when={item.scheduleDate}> - {item.scheduleDate}</Show>
                </p>
              </div>
              <StatusSelect
                value={item.status}
                onChange={(status) => props.onStatus(item.id, status)}
              />
              <PrioritySelect
                value={item.priority}
                onChange={(priority) => props.onPriority(item.id, priority)}
              />
            </article>
          )}
        </For>
      </Show>
    </div>
  );
}

function ProjectList(props: { projects: readonly WorkProject[] }) {
  return (
    <div class="mt-3 grid gap-1.5">
      <Show when={props.projects.length > 0} fallback={<EmptyRow label="No projects yet" />}>
        <For each={props.projects}>
          {(project) => (
            <article class="grid gap-2 rounded-xs border border-border bg-bg-primary p-2.5 sm:grid-cols-[minmax(0,1fr)_8rem]">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-text-primary">{project.name}</p>
                <Show when={project.scheduleDate}>
                  <p class="mt-1 text-[0.75rem] text-text-muted">{project.scheduleDate}</p>
                </Show>
              </div>
              <ProjectStatusSelect
                value={project.status}
                onChange={(status) => updateWorkProjectStatus(project.id, status)}
              />
            </article>
          )}
        </For>
      </Show>
    </div>
  );
}

function EmptyRow(props: { label: string }) {
  return (
    <p class="rounded-xs border border-dashed border-border bg-bg-primary px-3 py-3 text-sm text-text-muted">
      {props.label}
    </p>
  );
}

function ProjectSelect(props: { value: string | null; onChange: (value: string | null) => void }) {
  return (
    <select
      class={SELECT_CLASS}
      aria-label="Task project"
      value={props.value ?? ""}
      onChange={(event) => props.onChange(event.currentTarget.value || null)}
    >
      <option value="">No project</option>
      <For each={workOsState.projects}>
        {(project) => <option value={project.id}>{project.name}</option>}
      </For>
    </select>
  );
}

function StatusSelect(props: { value: WorkItemStatus; onChange: (value: WorkItemStatus) => void }) {
  return (
    <select
      class={SELECT_CLASS}
      aria-label="Work status"
      value={props.value}
      onChange={(event) =>
        props.onChange(workItemStatusFromValue(event.currentTarget.value, props.value))
      }
    >
      <For each={WORK_ITEM_STATUSES}>{(status) => <option value={status}>{status}</option>}</For>
    </select>
  );
}

function ProjectStatusSelect(props: {
  value: WorkProjectStatus;
  onChange: (value: WorkProjectStatus) => void;
}) {
  return (
    <select
      class={SELECT_CLASS}
      aria-label="Project status"
      value={props.value}
      onChange={(event) =>
        props.onChange(workProjectStatusFromValue(event.currentTarget.value, props.value))
      }
    >
      <For each={PROJECT_STATUSES}>{(status) => <option value={status}>{status}</option>}</For>
    </select>
  );
}

function PrioritySelect(props: { value: WorkPriority; onChange: (value: WorkPriority) => void }) {
  return (
    <select
      class={SELECT_CLASS}
      aria-label="Work priority"
      value={props.value}
      onChange={(event) => props.onChange(priorityFromValue(event.currentTarget.value, props.value))}
    >
      <For each={WORK_PRIORITIES}>{(priority) => <option value={priority}>{priority}</option>}</For>
    </select>
  );
}

function projectNameFor(projectId: string | null): string | null {
  if (!projectId) return null;
  return workOsState.projects.find((project) => project.id === projectId)?.name ?? null;
}

function workItemStatusFromValue(value: string, fallback: WorkItemStatus): WorkItemStatus {
  return WORK_ITEM_STATUSES.find((status) => status === value) ?? fallback;
}

function workProjectStatusFromValue(value: string, fallback: WorkProjectStatus): WorkProjectStatus {
  return PROJECT_STATUSES.find((status) => status === value) ?? fallback;
}

function priorityFromValue(value: string, fallback: WorkPriority): WorkPriority {
  return WORK_PRIORITIES.find((priority) => priority === value) ?? fallback;
}

export {
  BUTTON_CLASS,
  EmptyRow,
  INPUT_CLASS,
  Metric,
  PrioritySelect,
  ProjectList,
  ProjectSelect,
  SectionHeader,
  WorkItemList,
};
