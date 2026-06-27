import { openRightPanelView } from "~/stores/layout";
import { openTab } from "~/stores/files";
import {
  findInTree,
  isFolderExpanded,
  revealPath,
  setSelectedPath,
  toggleFolder,
  vaultState,
} from "~/stores/vault";

const MOMO_TODAY_TAB_TYPE = "today";

const MOMO_OPERATION_ENTRIES = [
  { id: "today", label: "Today", kind: "tab" },
  { id: "inbox", label: "Inbox", kind: "folder", path: "Inbox" },
  { id: "tasks", label: "Tasks", kind: "folder", path: "Tasks" },
  { id: "projects", label: "Projects", kind: "folder", path: "Projects" },
  { id: "issues", label: "Issues", kind: "folder", path: "Issues" },
  { id: "daily", label: "Daily", kind: "folder", path: "Daily" },
  { id: "knowledge", label: "Knowledge", kind: "folder", path: "Knowledge" },
  { id: "search", label: "Search", kind: "tab" },
  { id: "graph", label: "Graph", kind: "tab" },
  { id: "ai-chat", label: "AI Chat", kind: "panel" },
] as const;

type MomoSurfaceId = (typeof MOMO_OPERATION_ENTRIES)[number]["id"];

function assertNever(_value: never): never {
  throw new Error("Unhandled Momo surface");
}

function openMomoFolder(path: string): void {
  const entry = findInTree(vaultState.files, path);
  if (!entry?.is_directory) return;

  setSelectedPath(path);
  revealPath(path);
  if (!isFolderExpanded(path)) toggleFolder(path);
}

function openMomoSurface(surfaceId: MomoSurfaceId): void {
  switch (surfaceId) {
    case "today":
      openTab("Today", null, MOMO_TODAY_TAB_TYPE);
      return;
    case "inbox":
      openMomoFolder("Inbox");
      return;
    case "tasks":
      openMomoFolder("Tasks");
      return;
    case "projects":
      openMomoFolder("Projects");
      return;
    case "issues":
      openMomoFolder("Issues");
      return;
    case "daily":
      openMomoFolder("Daily");
      return;
    case "knowledge":
      openMomoFolder("Knowledge");
      return;
    case "search":
      openTab("Advanced Search", null, "search");
      return;
    case "graph":
      openTab("Graph", null, "graph");
      return;
    case "ai-chat":
      openRightPanelView("ai-chat.panel");
      return;
    default:
      assertNever(surfaceId);
  }
}

export { MOMO_OPERATION_ENTRIES, MOMO_TODAY_TAB_TYPE, assertNever, openMomoSurface };
export type { MomoSurfaceId };
