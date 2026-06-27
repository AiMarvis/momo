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

  it("renders Life and Build lanes plus expected operational entries", async () => {
    const { MOMO_OPERATION_ENTRIES } = await import("./navigation");
    const { TodayDashboard } = await import("./today_dashboard");

    const html = renderToString(() => <TodayDashboard />);
    const labels = MOMO_OPERATION_ENTRIES.map((entry) => entry.label);

    expect(html).toContain("Life");
    expect(html).toContain("Build");
    expect(html).toContain("Quick Inbox");
    expect(html).toContain("Agent");
    expect(labels).toEqual([
      "Today",
      "Inbox",
      "Tasks",
      "Projects",
      "Issues",
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
