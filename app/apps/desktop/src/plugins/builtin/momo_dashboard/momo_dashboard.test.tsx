import { renderToString } from "solid-js/web";
import { beforeEach, describe, expect, it, vi } from "vitest";

class StorageMock {
  readonly #store = new Map<string, string>();

  clear(): void {
    this.#store.clear();
  }

  getItem(key: string): string | null {
    return this.#store.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.#store.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#store.set(key, value);
  }

  get length(): number {
    return this.#store.size;
  }
}

function installBrowserGlobals(): void {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      innerWidth: 1440,
      innerHeight: 900,
    },
  });

  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: new StorageMock(),
  });
}

describe("Momo dashboard shell", () => {
  beforeEach(() => {
    installBrowserGlobals();
    vi.resetModules();
    vi.doUnmock("~/plugins/slots");
    vi.doUnmock("~/stores/vault");
  });

  it("opens Today as a singleton center tab and preserves Search and Graph tabs", async () => {
    const navigation = await import("./navigation");
    const files = await import("~/stores/files");

    navigation.openMomoSurface("today");

    expect(files.getActiveTab()?.type).toBe("today");
    expect(files.filesState.tabs).toHaveLength(1);

    navigation.openMomoSurface("search");
    expect(files.getActiveTab()?.type).toBe("search");

    navigation.openMomoSurface("graph");
    expect(files.getActiveTab()?.type).toBe("graph");

    navigation.openMomoSurface("today");
    expect(files.getActiveTab()?.type).toBe("today");
    expect(files.filesState.tabs.filter((tab) => tab.type === "today")).toHaveLength(1);
  });

  it("opens Calendar from the right panel menu surface", async () => {
    const navigation = await import("./navigation");
    const layout = await import("~/stores/layout");

    navigation.openMomoSurface("calendar");

    expect(layout.layoutState.rightPanelOpen).toBe(true);
    expect(layout.layoutState.activeRightPanelViewId).toBe("momo-dashboard.calendar");
  });

  it("keeps AI Chat reachable from the operational nav without replacing center tabs", async () => {
    const navigation = await import("./navigation");
    const layout = await import("~/stores/layout");

    navigation.openMomoSurface("ai-chat");

    expect(layout.layoutState.rightPanelOpen).toBe(true);
    expect(layout.layoutState.activeRightPanelViewId).toBe("ai-chat.panel");
  });

  it("routes Inbox and Knowledge nav entries to live app surfaces without a vault", async () => {
    const navigation = await import("./navigation");
    const layout = await import("~/stores/layout");

    navigation.openMomoSurface("inbox");
    expect(layout.layoutState.rightPanelOpen).toBe(true);
    expect(layout.layoutState.activeRightPanelViewId).toBe("momo-dashboard.agent");

    navigation.openMomoSurface("knowledge");
    expect(layout.layoutState.activeRightPanelViewId).toBe("knowledge.panel");
  });

  it("falls back to the Knowledge folder when the Knowledge panel is unavailable", async () => {
    const selectedPaths: (string | null)[] = [];
    const toggledFolders: string[] = [];
    const fakeVaultState = {
      rootPath: "/tmp/momo-vault",
      files: [{ name: "Knowledge", path: "Knowledge", is_directory: true }],
      expandedFolders: new Set<string>(),
    };
    vi.doMock("~/plugins/slots", () => ({
      getRightPanelFill: () => undefined,
    }));
    vi.doMock("~/stores/vault", () => ({
      vaultState: fakeVaultState,
      findInTree: (entries: typeof fakeVaultState.files, targetPath: string) =>
        entries.find((entry) => entry.path === targetPath) ?? null,
      isFolderExpanded: (path: string) => fakeVaultState.expandedFolders.has(path),
      revealPath: vi.fn(),
      setSelectedPath: (path: string | null) => selectedPaths.push(path),
      toggleFolder: (path: string) => toggledFolders.push(path),
    }));
    const navigation = await import("./navigation");

    navigation.openMomoSurface("knowledge");

    expect(selectedPaths).toEqual(["Knowledge"]);
    expect(toggledFolders).toEqual(["Knowledge"]);
  });

  it("keeps operational nav buttons enabled without a vault", async () => {
    const { MomoOperationalNav } = await import("./momo_nav");

    const html = renderToString(() => <MomoOperationalNav />);

    expect(html).toContain("Inbox");
    expect(html).toContain("Knowledge");
    expect(html).not.toContain("Daily");
    expect(html).not.toContain("disabled");
  });

  it("renders Today as an independent Work OS dashboard", async () => {
    const { MOMO_OPERATION_ENTRIES } = await import("./navigation");
    const { TodayDashboard } = await import("./today_dashboard");

    const html = renderToString(() => <TodayDashboard />);
    const labels = MOMO_OPERATION_ENTRIES.map((entry) => entry.label);

    expect(html).toContain("Today overview");
    expect(html).toContain("Daily to-dos, projects, calendar dates, issues, and ideas");
    expect(html).toContain("Daily");
    expect(html).toContain("Due today");
    expect(html).toContain("Next focus");
    expect(html).toContain("No daily focus yet");
    expect(html).toContain("Add to-do");
    expect(html).toContain("Daily to-do");
    expect(html).toContain("Projects");
    expect(html).toContain("Project issues");
    expect(html).toContain("Project ranges");
    expect(html).toContain("Scheduled windows with task and issue progress");
    expect(html).toContain("Ideas");
    expect(html).toContain("Daily to-do list");
    expect(html).toContain("Project database");
    expect(html).toContain("Status / Priority / Project / Date");
    expect(html).toContain("Status / Range / Tasks / Issues");
    expect(html).toContain("Status");
    expect(html).toContain("Priority");
    expect(html).toContain("Date");
    expect(html).toContain("To-do date");
    expect(html).toContain("Project start date");
    expect(html).toContain("Project end date");
    expect(html).toContain("Issue project");
    expect(html).toContain("No ideas yet");
    expect(html).toContain("No daily to-dos yet");
    expect(html).not.toContain("Daily to-dos and project ranges by date");
    expect(html).not.toContain("No scheduled work yet");
    expect(html).not.toContain("Start with your own Markdown files");
    expect(html).not.toContain("Markdown");
    expect(html).not.toContain("open a vault");
    expect(html).not.toContain("lecture followup with Minji");
    expect(html).not.toContain("Review lecture follow-ups");
    expect(html).not.toContain("Ship dashboard shell");
    expect(labels).toEqual([
      "Today",
      "Inbox",
      "Knowledge",
      "Search",
      "Graph",
      "AI Chat",
    ]);
  });

  it("renders Work OS properties as scannable rows", async () => {
    const store = await import("./work_os_store");
    const { TodayDashboard } = await import("./today_dashboard");

    const project = store.createWorkProject({
      name: "Momo desktop",
      startDate: "2026-07-05",
      endDate: "2026-07-07",
    });
    const task = store.createWorkTask({
      title: "Review calendar grouping",
      projectId: project.id,
      priority: "high",
      scheduleDate: "2026-07-05",
    });
    store.updateWorkTaskStatus(task.id, "doing");
    store.createWorkIssue({
      title: "Confirm project range",
      projectId: project.id,
      priority: "low",
    });
    store.createWorkIssue({
      title: "Unlinked blocker",
      projectId: null,
      priority: "medium",
    });
    store.createWorkIdea("Try sidebar sticky ideas");

    const html = renderToString(() => <TodayDashboard />);

    expect(html).toContain("Momo desktop");
    expect(html).toContain("Review calendar grouping");
    expect(html).toContain("2026-07-05");
    expect(html).toContain("2026-07-07");
    expect(html).toContain("high");
    expect(html).toContain("doing");
    expect(html).toContain("ranges");
    expect(html).toContain("style=\"width:0%\"");
    expect(html).toContain("done");
    expect(html).toContain("1 open");
    expect(html).toContain("Confirm project range");
    expect(html).toContain("Unlinked blocker");
    expect(html).toContain("No project");
    expect(html).toContain("Delete");
    expect(html).toContain("Try sidebar sticky ideas");
  });

  it("shows a reachable choose-one agent state for no or unsupported Inbox selection", async () => {
    const { agentPanelCopyForState } = await import("./agent_panel");

    expect(agentPanelCopyForState({ kind: "empty" })).toEqual({
      title: "Choose one Inbox note",
      detail: "Select exactly one source note under Inbox",
    });
    expect(agentPanelCopyForState({ kind: "batch_unavailable", count: 2 })).toEqual({
      title: "Choose one Inbox note",
      detail: "Select exactly one source note under Inbox",
    });
  });
});
