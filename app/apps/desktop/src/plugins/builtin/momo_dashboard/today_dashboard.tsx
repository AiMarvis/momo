import { createMemo, createSignal } from "solid-js";

import { PlusIcon } from "~/components/icons";

import {
  createWorkIssue,
  createWorkProject,
  createWorkTask,
  initWorkOsStore,
  updateWorkIssuePriority,
  updateWorkIssueStatus,
  updateWorkTaskPriority,
  updateWorkTaskStatus,
  workOsState,
  type WorkPriority,
} from "./work_os_store";
import { CalendarSection, IdeaSection } from "./work_os_calendar_ideas";
import {
  BUTTON_CLASS,
  INPUT_CLASS,
  Metric,
  PrioritySelect,
  ProjectList,
  ProjectSelect,
  SectionHeader,
  WorkItemList,
} from "./work_os_dashboard_parts";

function TodayDashboard() {
  initWorkOsStore();

  const [taskTitle, setTaskTitle] = createSignal("");
  const [taskScheduleDate, setTaskScheduleDate] = createSignal("");
  const [issueTitle, setIssueTitle] = createSignal("");
  const [projectName, setProjectName] = createSignal("");
  const [projectScheduleDate, setProjectScheduleDate] = createSignal("");
  const [taskProjectId, setTaskProjectId] = createSignal<string | null>(null);
  const [taskPriority, setTaskPriority] = createSignal<WorkPriority>("medium");
  const [issuePriority, setIssuePriority] = createSignal<WorkPriority>("medium");

  const activeTaskCount = createMemo(
    () => workOsState.tasks.filter((task) => task.status !== "done").length,
  );
  const activeProjectCount = createMemo(
    () => workOsState.projects.filter((project) => project.status !== "done").length,
  );

  function submitTask(event: SubmitEvent): void {
    event.preventDefault();
    if (!taskTitle().trim()) return;
    createWorkTask({
      title: taskTitle(),
      projectId: taskProjectId(),
      priority: taskPriority(),
      scheduleDate: taskScheduleDate() || null,
    });
    setTaskTitle("");
    setTaskScheduleDate("");
  }

  function submitIssue(event: SubmitEvent): void {
    event.preventDefault();
    if (!issueTitle().trim()) return;
    createWorkIssue({
      title: issueTitle(),
      projectId: null,
      priority: issuePriority(),
    });
    setIssueTitle("");
  }

  function submitProject(event: SubmitEvent): void {
    event.preventDefault();
    if (!projectName().trim()) return;
    const project = createWorkProject(projectName(), projectScheduleDate() || null);
    setTaskProjectId(project.id);
    setProjectName("");
    setProjectScheduleDate("");
  }

  return (
    <main class="h-full overflow-y-auto bg-bg-primary" data-momo-surface="today-dashboard">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 lg:p-5">
        <header class="rounded-xs border border-border bg-bg-secondary/70 px-4 py-3">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-[0.6875rem] font-semibold tracking-[0.16em] text-text-muted uppercase">
                Today
              </p>
              <h1 class="mt-1 text-[1.15rem] font-semibold text-text-primary">
                Today operations
              </h1>
              <p class="mt-1 max-w-2xl text-xs text-text-secondary">
                Create work, assign priority, and move the day through status from one quiet
                dashboard.
              </p>
            </div>
            <div class="grid min-w-56 grid-cols-3 gap-2 text-right">
              <Metric label="Tasks" value={activeTaskCount()} />
              <Metric label="Projects" value={activeProjectCount()} />
              <Metric label="Issues" value={workOsState.issues.length} />
            </div>
          </div>
        </header>

        <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section class="rounded-xs border border-border bg-bg-secondary/70 p-4">
            <SectionHeader title="Tasks" detail="What needs movement today" />
            <form
              class="mt-3 grid gap-2 md:grid-cols-[minmax(0,1fr)_10rem_8.5rem_8rem_auto]"
              onSubmit={submitTask}
            >
              <input
                class={INPUT_CLASS}
                aria-label="Task title"
                value={taskTitle()}
                placeholder="Task title"
                onInput={(event) => setTaskTitle(event.currentTarget.value)}
              />
              <ProjectSelect value={taskProjectId()} onChange={setTaskProjectId} />
              <input
                class={INPUT_CLASS}
                aria-label="Task date"
                type="date"
                value={taskScheduleDate()}
                onInput={(event) => setTaskScheduleDate(event.currentTarget.value)}
              />
              <PrioritySelect value={taskPriority()} onChange={setTaskPriority} />
              <button type="submit" class={BUTTON_CLASS}>
                <PlusIcon size={14} />
                <span>Create task</span>
              </button>
            </form>
            <WorkItemList
              emptyLabel="No tasks yet"
              items={workOsState.tasks}
              onPriority={updateWorkTaskPriority}
              onStatus={updateWorkTaskStatus}
            />
          </section>

          <section class="grid gap-4">
            <CalendarSection />

            <section class="rounded-xs border border-border bg-bg-secondary/70 p-4">
              <SectionHeader title="Projects" detail="Independent work streams" />
              <form
                class="mt-3 grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_8.5rem_auto]"
                onSubmit={submitProject}
              >
                <input
                  class={INPUT_CLASS}
                  aria-label="Project name"
                  value={projectName()}
                  placeholder="Project name"
                  onInput={(event) => setProjectName(event.currentTarget.value)}
                />
                <input
                  class={INPUT_CLASS}
                  aria-label="Project date"
                  type="date"
                  value={projectScheduleDate()}
                  onInput={(event) => setProjectScheduleDate(event.currentTarget.value)}
                />
                <button type="submit" class={BUTTON_CLASS}>
                  <PlusIcon size={14} />
                  <span>Create</span>
                </button>
              </form>
              <ProjectList projects={workOsState.projects} />
            </section>

            <section class="rounded-xs border border-border bg-bg-secondary/70 p-4">
              <SectionHeader title="Issues" detail="Open decisions and blockers" />
              <form
                class="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_auto]"
                onSubmit={submitIssue}
              >
                <input
                  class={INPUT_CLASS}
                  aria-label="Issue title"
                  value={issueTitle()}
                  placeholder="Issue title"
                  onInput={(event) => setIssueTitle(event.currentTarget.value)}
                />
                <PrioritySelect value={issuePriority()} onChange={setIssuePriority} />
                <button type="submit" class={BUTTON_CLASS}>
                  <PlusIcon size={14} />
                  <span>Create</span>
                </button>
              </form>
              <WorkItemList
                emptyLabel="No issues yet"
                items={workOsState.issues}
                onPriority={updateWorkIssuePriority}
                onStatus={updateWorkIssueStatus}
              />
            </section>

            <IdeaSection />
          </section>
        </section>
      </div>
    </main>
  );
}

export { TodayDashboard };
