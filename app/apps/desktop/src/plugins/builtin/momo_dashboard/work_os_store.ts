import { createStore } from "solid-js/store";

const WORK_OS_STORAGE_KEY = "momo-work-os-v1";

const WORK_ITEM_STATUSES = ["todo", "doing", "done"] as const;
const PROJECT_STATUSES = ["active", "paused", "done"] as const;
const WORK_PRIORITIES = ["low", "medium", "high"] as const;

type WorkItemStatus = (typeof WORK_ITEM_STATUSES)[number];
type WorkProjectStatus = (typeof PROJECT_STATUSES)[number];
type WorkPriority = (typeof WORK_PRIORITIES)[number];

interface WorkItemDraft {
  readonly title: string;
  readonly projectId: string | null;
  readonly priority: WorkPriority;
  readonly scheduleDate?: string | null;
}

interface WorkItem {
  readonly id: string;
  readonly title: string;
  readonly projectId: string | null;
  readonly status: WorkItemStatus;
  readonly priority: WorkPriority;
  readonly scheduleDate: string | null;
  readonly createdAt: string;
}

interface WorkProject {
  readonly id: string;
  readonly name: string;
  readonly status: WorkProjectStatus;
  readonly scheduleDate: string | null;
  readonly createdAt: string;
}

interface WorkIdea {
  readonly id: string;
  readonly text: string;
  readonly createdAt: string;
}

interface WorkOsState {
  readonly tasks: readonly WorkItem[];
  readonly issues: readonly WorkItem[];
  readonly projects: readonly WorkProject[];
  readonly ideas: readonly WorkIdea[];
}

const EMPTY_WORK_OS_STATE: WorkOsState = {
  tasks: [],
  issues: [],
  projects: [],
  ideas: [],
};

const [workOsState, setWorkOsState] = createStore<WorkOsState>(loadWorkOsSnapshot());

function initWorkOsStore(): void {
  setWorkOsState(loadWorkOsSnapshot());
}

function createWorkProject(name: string, scheduleDate: string | null = null): WorkProject {
  const project: WorkProject = {
    id: createId("project"),
    name: normalizeTitle(name) || "Untitled project",
    status: "active",
    scheduleDate: normalizeDate(scheduleDate),
    createdAt: new Date().toISOString(),
  };
  setWorkOsState("projects", (projects) => [project, ...projects]);
  persistWorkOsState();
  return project;
}

function createWorkTask(draft: WorkItemDraft): WorkItem {
  const task = createWorkItem(draft);
  setWorkOsState("tasks", (tasks) => [task, ...tasks]);
  persistWorkOsState();
  return task;
}

function createWorkIssue(draft: WorkItemDraft): WorkItem {
  const issue = createWorkItem(draft);
  setWorkOsState("issues", (issues) => [issue, ...issues]);
  persistWorkOsState();
  return issue;
}

function createWorkIdea(text: string): WorkIdea {
  const idea: WorkIdea = {
    id: createId("idea"),
    text: normalizeTitle(text) || "Untitled idea",
    createdAt: new Date().toISOString(),
  };
  setWorkOsState("ideas", (ideas) => [idea, ...ideas]);
  persistWorkOsState();
  return idea;
}

function updateWorkTaskStatus(id: string, status: WorkItemStatus): void {
  setWorkOsState("tasks", (task) => task.id === id, "status", status);
  persistWorkOsState();
}

function updateWorkIssueStatus(id: string, status: WorkItemStatus): void {
  setWorkOsState("issues", (issue) => issue.id === id, "status", status);
  persistWorkOsState();
}

function updateWorkTaskPriority(id: string, priority: WorkPriority): void {
  setWorkOsState("tasks", (task) => task.id === id, "priority", priority);
  persistWorkOsState();
}

function updateWorkIssuePriority(id: string, priority: WorkPriority): void {
  setWorkOsState("issues", (issue) => issue.id === id, "priority", priority);
  persistWorkOsState();
}

function updateWorkProjectStatus(id: string, status: WorkProjectStatus): void {
  setWorkOsState("projects", (project) => project.id === id, "status", status);
  persistWorkOsState();
}

function deleteWorkIdea(id: string): void {
  setWorkOsState("ideas", (ideas) => ideas.filter((idea) => idea.id !== id));
  persistWorkOsState();
}

function resetWorkOsState(): void {
  setWorkOsState(EMPTY_WORK_OS_STATE);
  persistWorkOsState();
}

function createWorkItem(draft: WorkItemDraft): WorkItem {
  return {
    id: createId("work"),
    title: normalizeTitle(draft.title) || "Untitled work item",
    projectId: draft.projectId,
    status: "todo",
    priority: draft.priority,
    scheduleDate: normalizeDate(draft.scheduleDate),
    createdAt: new Date().toISOString(),
  };
}

function persistWorkOsState(): void {
  getStorage()?.setItem(
    WORK_OS_STORAGE_KEY,
    JSON.stringify({
      tasks: workOsState.tasks,
      issues: workOsState.issues,
      projects: workOsState.projects,
      ideas: workOsState.ideas,
    }),
  );
}

function loadWorkOsSnapshot(): WorkOsState {
  const raw = getStorage()?.getItem(WORK_OS_STORAGE_KEY);
  if (!raw) return EMPTY_WORK_OS_STATE;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY_WORK_OS_STATE;
    return {
      tasks: normalizeList(parsed.tasks, normalizeWorkItem),
      issues: normalizeList(parsed.issues, normalizeWorkItem),
      projects: normalizeList(parsed.projects, normalizeWorkProject),
      ideas: normalizeList(parsed.ideas, normalizeWorkIdea),
    };
  } catch {
    return EMPTY_WORK_OS_STATE;
  }
}

function normalizeList<T>(value: unknown, normalize: (item: unknown) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const normalized = normalize(item);
    return normalized ? [normalized] : [];
  });
}

function normalizeWorkItem(value: unknown): WorkItem | null {
  if (!isRecord(value)) return null;
  const id = normalizeTitle(value.id);
  const title = normalizeTitle(value.title);
  if (!id || !title) return null;

  return {
    id,
    title,
    projectId: normalizeNullableTitle(value.projectId),
    status: isWorkItemStatus(value.status) ? value.status : "todo",
    priority: isWorkPriority(value.priority) ? value.priority : "medium",
    scheduleDate: normalizeDate(value.scheduleDate),
    createdAt: normalizeTitle(value.createdAt) || new Date().toISOString(),
  };
}

function normalizeWorkProject(value: unknown): WorkProject | null {
  if (!isRecord(value)) return null;
  const id = normalizeTitle(value.id);
  const name = normalizeTitle(value.name);
  if (!id || !name) return null;

  return {
    id,
    name,
    status: isWorkProjectStatus(value.status) ? value.status : "active",
    scheduleDate: normalizeDate(value.scheduleDate),
    createdAt: normalizeTitle(value.createdAt) || new Date().toISOString(),
  };
}

function normalizeWorkIdea(value: unknown): WorkIdea | null {
  if (!isRecord(value)) return null;
  const id = normalizeTitle(value.id);
  const text = normalizeTitle(value.text);
  if (!id || !text) return null;

  return {
    id,
    text,
    createdAt: normalizeTitle(value.createdAt) || new Date().toISOString(),
  };
}

function normalizeTitle(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDate(value: unknown): string | null {
  const date = normalizeTitle(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

function normalizeNullableTitle(value: unknown): string | null {
  const title = normalizeTitle(value);
  return title || null;
}

function isWorkItemStatus(value: unknown): value is WorkItemStatus {
  return WORK_ITEM_STATUSES.some((status) => status === value);
}

function isWorkProjectStatus(value: unknown): value is WorkProjectStatus {
  return PROJECT_STATUSES.some((status) => status === value);
}

function isWorkPriority(value: unknown): value is WorkPriority {
  return WORK_PRIORITIES.some((priority) => priority === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStorage(): Storage | null {
  return typeof localStorage === "undefined" ? null : localStorage;
}

function createId(prefix: string): string {
  const randomUuid = globalThis.crypto?.randomUUID;
  return `${prefix}-${randomUuid ? randomUuid.call(globalThis.crypto) : `${Date.now()}`}`;
}

export {
  PROJECT_STATUSES,
  WORK_ITEM_STATUSES,
  WORK_PRIORITIES,
  createWorkIdea,
  createWorkIssue,
  createWorkProject,
  createWorkTask,
  deleteWorkIdea,
  initWorkOsStore,
  resetWorkOsState,
  updateWorkIssuePriority,
  updateWorkIssueStatus,
  updateWorkProjectStatus,
  updateWorkTaskPriority,
  updateWorkTaskStatus,
  workOsState,
};
export type { WorkIdea, WorkItem, WorkItemStatus, WorkPriority, WorkProject, WorkProjectStatus };
