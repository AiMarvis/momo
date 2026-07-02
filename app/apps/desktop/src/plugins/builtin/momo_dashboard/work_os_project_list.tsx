import { For, Show } from "solid-js";

import {
  deleteWorkProject,
  updateWorkIssuePriority,
  updateWorkIssueStatus,
  updateWorkProjectDates,
  updateWorkProjectStatus,
  workOsState,
  type WorkItem,
  type WorkProject,
} from "./work_os_store";
import {
  DatabaseBar,
  EmptyRow,
  PrioritySelect,
  ProjectStatusSelect,
  SELECT_CLASS,
  StatusSelect,
  TableHeader,
  TableText,
} from "./work_os_dashboard_parts";

function ProjectList(props: { projects: readonly WorkProject[] }) {
  const noProjectIssues = () => workOsState.issues.filter((issue) => issue.projectId === null);

  return (
    <div class="mt-3 min-w-0 overflow-hidden rounded-xs border border-border bg-bg-primary">
      <DatabaseBar
        count={props.projects.length}
        label="Project database"
        properties="Status / Range / Tasks / Issues"
      />
      <TableHeader columns="2xl:grid 2xl:grid-cols-[minmax(12rem,1fr)_7rem_8rem_8rem_6rem_5rem]">
        <span>Project</span>
        <span>Status</span>
        <span>Start</span>
        <span>End</span>
        <span>Tasks</span>
        <span>Action</span>
      </TableHeader>
      <Show when={props.projects.length > 0} fallback={<EmptyRow label="No projects yet" />}>
        <For each={props.projects}>
          {(project) => (
            <article class="grid min-w-0 gap-2 border-b border-border p-2.5 transition-colors last:border-b-0 hover:bg-ghost-hover 2xl:grid-cols-[minmax(12rem,1fr)_7rem_8rem_8rem_6rem_5rem] 2xl:items-center">
              <div class="min-w-0 2xl:self-start">
                <p class="truncate text-sm font-medium text-text-primary">{project.name}</p>
                <p class="mt-1 truncate text-[0.75rem] text-text-muted">
                  created {formatDate(project.createdAt)}
                </p>
              </div>
              <ProjectStatusSelect
                value={project.status}
                onChange={(status) => updateWorkProjectStatus(project.id, status)}
              />
              <input
                class={SELECT_CLASS}
                aria-label={`Project start date for ${project.name}`}
                type="date"
                value={project.startDate ?? ""}
                onInput={(event) =>
                  updateWorkProjectDates(project.id, event.currentTarget.value || null, project.endDate)
                }
              />
              <input
                class={SELECT_CLASS}
                aria-label={`Project end date for ${project.name}`}
                type="date"
                value={project.endDate ?? ""}
                onInput={(event) =>
                  updateWorkProjectDates(
                    project.id,
                    project.startDate,
                    event.currentTarget.value || null,
                  )
                }
              />
              <TableText value={`${activeTaskCountForProject(project.id)} open`} />
              <button
                type="button"
                class="rounded-xs border border-border bg-bg-primary px-2 py-1.5 text-xs text-text-secondary transition-colors hover:bg-ghost-hover hover:text-text-primary"
                title="Delete project and unlink tasks/issues"
                onClick={() => deleteWorkProject(project.id)}
              >
                Delete
              </button>
              <IssueRows issues={issuesForProject(project.id)} />
            </article>
          )}
        </For>
      </Show>
      <Show when={noProjectIssues().length > 0}>
        <article class="border-t border-border p-2.5">
          <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm font-medium text-text-primary">No project</p>
            <p class="font-mono text-[0.6875rem] text-text-muted">
              {noProjectIssues().length} issue rows
            </p>
          </div>
          <IssueRows issues={noProjectIssues()} />
        </article>
      </Show>
    </div>
  );
}

function IssueRows(props: { issues: readonly WorkItem[] }) {
  return (
    <div class="min-w-0 2xl:col-span-6">
      <Show
        when={props.issues.length > 0}
        fallback={<p class="text-[0.75rem] text-text-muted">No linked issues</p>}
      >
        <div class="grid gap-1">
          <For each={props.issues}>
            {(issue) => (
              <div class="grid min-w-0 gap-1 rounded-xs border border-border bg-bg-secondary/70 p-1.5 md:grid-cols-[minmax(10rem,1fr)_7rem_7rem] md:items-center">
                <p class="truncate text-[0.75rem] font-medium text-text-primary">{issue.title}</p>
                <StatusSelect
                  value={issue.status}
                  onChange={(status) => updateWorkIssueStatus(issue.id, status)}
                />
                <PrioritySelect
                  value={issue.priority}
                  onChange={(priority) => updateWorkIssuePriority(issue.id, priority)}
                />
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

function activeTaskCountForProject(projectId: string): number {
  return workOsState.tasks.filter((task) => task.projectId === projectId && task.status !== "done")
    .length;
}

function issuesForProject(projectId: string): WorkItem[] {
  return workOsState.issues.filter((issue) => issue.projectId === projectId);
}

function formatDate(value: string): string {
  return value.slice(0, 10);
}

export { ProjectList };
