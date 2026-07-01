import { beforeEach, describe, expect, it, vi } from "vitest";

class StorageMock {
  readonly #store = new Map<string, string>();

  clear(): void {
    this.#store.clear();
  }

  getItem(key: string): string | null {
    return this.#store.get(key) ?? null;
  }

  removeItem(key: string): void {
    this.#store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#store.set(key, value);
  }
}

function installBrowserGlobals(): void {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: new StorageMock(),
  });
}

async function loadStore() {
  vi.resetModules();
  return import("./work_os_store");
}

describe("Work OS store", () => {
  beforeEach(() => {
    installBrowserGlobals();
  });

  it("creates projects and tasks independently from vault files", async () => {
    const store = await loadStore();

    const project = store.createWorkProject("Desktop app", "2026-07-03");
    const task = store.createWorkTask({
      title: "Triage today's work",
      projectId: project.id,
      priority: "high",
      scheduleDate: "2026-07-02",
    });

    store.updateWorkTaskStatus(task.id, "doing");
    store.updateWorkTaskPriority(task.id, "low");
    store.updateWorkProjectStatus(project.id, "paused");

    expect(store.workOsState.projects).toMatchObject([
      { id: project.id, name: "Desktop app", scheduleDate: "2026-07-03", status: "paused" },
    ]);
    expect(store.workOsState.tasks).toMatchObject([
      {
        id: task.id,
        title: "Triage today's work",
        projectId: project.id,
        priority: "low",
        scheduleDate: "2026-07-02",
        status: "doing",
      },
    ]);
  });

  it("loads persisted work without sample data", async () => {
    const first = await loadStore();

    const project = first.createWorkProject("Momo");
    first.createWorkTask({
      title: "Prepare dashboard",
      projectId: project.id,
      priority: "medium",
      scheduleDate: "2026-07-04",
    });
    const idea = first.createWorkIdea("Try sticky ideas");

    const second = await loadStore();
    second.initWorkOsStore();

    expect(second.workOsState.projects).toHaveLength(1);
    expect(second.workOsState.projects[0]?.name).toBe("Momo");
    expect(second.workOsState.tasks).toHaveLength(1);
    expect(second.workOsState.tasks[0]?.title).toBe("Prepare dashboard");
    expect(second.workOsState.tasks[0]?.scheduleDate).toBe("2026-07-04");
    expect(second.workOsState.ideas).toMatchObject([{ id: idea.id, text: "Try sticky ideas" }]);
  });

  it("normalizes invalid persisted dates and deletes ideas", async () => {
    localStorage.setItem(
      "momo-work-os-v1",
      JSON.stringify({
        tasks: [
          {
            id: "work-1",
            title: "Invalid task date",
            projectId: null,
            status: "todo",
            priority: "medium",
            scheduleDate: "tomorrow",
            createdAt: "2026-07-01T00:00:00.000Z",
          },
        ],
        issues: [],
        projects: [
          {
            id: "project-1",
            name: "Invalid project date",
            status: "active",
            scheduleDate: "2026/07/05",
            createdAt: "2026-07-01T00:00:00.000Z",
          },
        ],
        ideas: [],
      }),
    );

    const store = await loadStore();
    store.initWorkOsStore();
    const idea = store.createWorkIdea("Delete me");
    store.deleteWorkIdea(idea.id);

    expect(store.workOsState.tasks[0]?.scheduleDate).toBeNull();
    expect(store.workOsState.projects[0]?.scheduleDate).toBeNull();
    expect(store.workOsState.ideas).toHaveLength(0);
  });
});
