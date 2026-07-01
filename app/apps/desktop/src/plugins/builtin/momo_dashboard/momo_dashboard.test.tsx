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

  it("keeps AI Chat reachable from the operational nav without replacing center tabs", async () => {
    const navigation = await import("./navigation");
    const layout = await import("~/stores/layout");

    navigation.openMomoSurface("ai-chat");

    expect(layout.layoutState.rightPanelOpen).toBe(true);
    expect(layout.layoutState.activeRightPanelViewId).toBe("ai-chat.panel");
  });

  it("renders Today as an independent Work OS dashboard", async () => {
    const { MOMO_OPERATION_ENTRIES } = await import("./navigation");
    const { TodayDashboard } = await import("./today_dashboard");

    const html = renderToString(() => <TodayDashboard />);
    const labels = MOMO_OPERATION_ENTRIES.map((entry) => entry.label);

    expect(html).toContain("Today operations");
    expect(html).toContain("Create task");
    expect(html).toContain("Tasks");
    expect(html).toContain("Projects");
    expect(html).toContain("Issues");
    expect(html).toContain("Calendar");
    expect(html).toContain("Ideas");
    expect(html).toContain("Task date");
    expect(html).toContain("Project date");
    expect(html).toContain("No scheduled work yet");
    expect(html).toContain("No ideas yet");
    expect(html).toContain("No tasks yet");
    expect(html).not.toContain("Start with your own Markdown files");
    expect(html).not.toContain("Markdown");
    expect(html).not.toContain("open a vault");
    expect(html).not.toContain("lecture followup with Minji");
    expect(html).not.toContain("Review lecture follow-ups");
    expect(html).not.toContain("Ship dashboard shell");
    expect(labels).toEqual([
      "Today",
      "Tasks",
      "Projects",
      "Issues",
      "Inbox",
      "Daily",
      "Knowledge",
      "Search",
      "Graph",
      "AI Chat",
    ]);
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
