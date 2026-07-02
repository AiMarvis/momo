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

interface WorkProjectDraft {
  readonly name: string;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
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
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly createdAt: string;
}

interface WorkProjectDateRange {
  readonly startDate: string | null;
  readonly endDate: string | null;
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

export { PROJECT_STATUSES, WORK_ITEM_STATUSES, WORK_PRIORITIES };
export type {
  WorkIdea,
  WorkItem,
  WorkItemDraft,
  WorkItemStatus,
  WorkOsState,
  WorkPriority,
  WorkProject,
  WorkProjectDateRange,
  WorkProjectDraft,
  WorkProjectStatus,
};
