import { type JSX, For, Show } from "solid-js";

import {
  FileIcon,
  FolderIcon,
  GraphIcon,
  KukuIcon,
  MessageSquareIcon,
  SearchIcon,
} from "~/components/icons";
import { getActiveTab } from "~/stores/files";
import { layoutState } from "~/stores/layout";
import { vaultState } from "~/stores/vault";

import {
  MOMO_OPERATION_ENTRIES,
  assertNever,
  openMomoSurface,
  type MomoSurfaceId,
} from "./navigation";

function iconForSurface(surfaceId: MomoSurfaceId): JSX.Element {
  switch (surfaceId) {
    case "today":
      return <KukuIcon size={14} />;
    case "search":
      return <SearchIcon size={14} />;
    case "graph":
      return <GraphIcon size={14} />;
    case "ai-chat":
      return <MessageSquareIcon size={14} />;
    case "inbox":
    case "tasks":
    case "projects":
    case "issues":
    case "daily":
    case "knowledge":
      return <FolderIcon size={14} />;
    default:
      return assertNever(surfaceId);
  }
}

function isActiveSurface(surfaceId: MomoSurfaceId): boolean {
  const activeTab = getActiveTab();
  switch (surfaceId) {
    case "today":
      return activeTab?.type === "today";
    case "search":
      return activeTab?.type === "search";
    case "graph":
      return activeTab?.type === "graph";
    case "ai-chat":
      return layoutState.rightPanelOpen && layoutState.activeRightPanelViewId === "ai-chat.panel";
    case "inbox":
      return vaultState.selectedPath?.startsWith("Inbox") === true;
    case "tasks":
      return vaultState.selectedPath?.startsWith("Tasks") === true;
    case "projects":
      return vaultState.selectedPath?.startsWith("Projects") === true;
    case "issues":
      return vaultState.selectedPath?.startsWith("Issues") === true;
    case "daily":
      return vaultState.selectedPath?.startsWith("Daily") === true;
    case "knowledge":
      return vaultState.selectedPath?.startsWith("Knowledge") === true;
    default:
      return assertNever(surfaceId);
  }
}

function MomoOperationalNav() {
  return (
    <Show when={vaultState.rootPath}>
      <nav class="border-b border-border p-2" aria-label="Momo operations">
        <div class="mb-1.5 px-1 text-[0.625rem] font-semibold tracking-[0.16em] text-text-muted uppercase">
          Momo
        </div>
        <div class="grid grid-cols-2 gap-1">
          <For each={MOMO_OPERATION_ENTRIES}>
            {(entry) => {
              const active = () => isActiveSurface(entry.id);
              return (
                <button
                  type="button"
                  class="flex min-w-0 items-center gap-1.5 rounded-xs px-2 py-1.5 text-left text-[0.75rem] text-text-secondary transition-colors hover:bg-ghost-hover hover:text-text-primary"
                  classList={{ "bg-list-active text-text-primary": active() }}
                  onClick={() => openMomoSurface(entry.id)}
                >
                  <span class={active() ? "shrink-0 text-icon" : "shrink-0 text-icon-muted"}>
                    {entry.id === "tasks" || entry.id === "issues" ? (
                      <FileIcon size={14} />
                    ) : (
                      iconForSurface(entry.id)
                    )}
                  </span>
                  <span class="min-w-0 truncate">{entry.label}</span>
                </button>
              );
            }}
          </For>
        </div>
      </nav>
    </Show>
  );
}

export { MomoOperationalNav };
