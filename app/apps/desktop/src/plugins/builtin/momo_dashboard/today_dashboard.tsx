import { createSignal, For, Show } from "solid-js";

import { PlusIcon } from "~/components/icons";

import { captureInboxNote } from "./inbox_capture";

const lifeItems = [
  { title: "Review lecture follow-ups", meta: "Life / People" },
  { title: "Plan one daily block", meta: "Daily / Schedule" },
  { title: "Capture loose errands", meta: "Inbox / Task" },
] as const;

const buildItems = [
  { title: "Ship dashboard shell", meta: "Build / Issue" },
  { title: "Check preserved Kuku surfaces", meta: "Search / Graph" },
  { title: "Hold risky agent changes", meta: "Agent / Review" },
] as const;

interface LaneItem {
  readonly title: string;
  readonly meta: string;
}

function Lane(props: { title: string; subtitle: string; items: readonly LaneItem[] }) {
  return (
    <section class="min-w-0 rounded-xs border border-border bg-bg-secondary/70">
      <div class="border-b border-border px-4 py-3">
        <p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-text-muted uppercase">
          {props.title}
        </p>
        <p class="mt-1 text-xs text-text-secondary">{props.subtitle}</p>
      </div>
      <div class="divide-y divide-border">
        <For each={props.items}>
          {(item) => (
            <article class="px-4 py-3">
              <p class="truncate text-sm font-medium text-text-primary">{item.title}</p>
              <p class="mt-1 text-[0.75rem] text-text-muted">{item.meta}</p>
            </article>
          )}
        </For>
      </div>
    </section>
  );
}

function TodayDashboard() {
  const [captureText, setCaptureText] = createSignal("");
  const [captureStatus, setCaptureStatus] = createSignal<"idle" | "saving" | "saved" | "empty">(
    "idle",
  );

  async function submitQuickCapture(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    setCaptureStatus("saving");

    const result = await captureInboxNote(captureText());
    if (result.status === "empty") {
      setCaptureStatus("empty");
      return;
    }

    setCaptureText("");
    setCaptureStatus("saved");
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
              <h1 class="mt-1 text-[1.15rem] font-semibold text-text-primary">Momo workspace</h1>
            </div>
            <div class="grid grid-cols-3 gap-2 text-right text-[0.6875rem] text-text-muted">
              <div class="rounded-xs border border-border bg-bg-primary px-2 py-1.5">
                <p class="text-text-secondary">Life</p>
                <p>3 items</p>
              </div>
              <div class="rounded-xs border border-border bg-bg-primary px-2 py-1.5">
                <p class="text-text-secondary">Build</p>
                <p>3 items</p>
              </div>
              <div class="rounded-xs border border-border bg-bg-primary px-2 py-1.5">
                <p class="text-text-secondary">Agent</p>
                <p>Idle</p>
              </div>
            </div>
          </div>
        </header>

        <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Lane
            title="Life"
            subtitle="People, meetings, errands, and follow-ups"
            items={lifeItems}
          />
          <Lane
            title="Build"
            subtitle="Apps, services, product work, and issues"
            items={buildItems}
          />
        </section>

        <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <form
            class="rounded-xs border border-border bg-bg-secondary/70 p-4"
            onSubmit={(event) => void submitQuickCapture(event)}
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-text-primary">Quick Inbox</p>
                <p class="mt-1 text-xs text-text-secondary">Preserved source note</p>
              </div>
              <span class="shrink-0 rounded-xs border border-border bg-bg-primary px-2 py-1 text-[0.6875rem] text-text-muted">
                Inbox
              </span>
            </div>
            <div class="mt-3 flex min-w-0 gap-2">
              <input
                class="min-w-0 flex-1 rounded-xs border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary transition-colors outline-none placeholder:text-text-muted focus:border-text-muted"
                aria-label="Quick Inbox capture"
                value={captureText()}
                placeholder="lecture followup with Minji"
                onInput={(event) => {
                  setCaptureText(event.currentTarget.value);
                  if (captureStatus() !== "idle") setCaptureStatus("idle");
                }}
              />
              <button
                type="submit"
                class="flex shrink-0 items-center gap-1.5 rounded-xs border border-border bg-bg-primary px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-ghost-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={captureStatus() === "saving"}
                title="Capture to Inbox"
              >
                <PlusIcon size={14} />
                <span>Capture</span>
              </button>
            </div>
            <Show when={captureStatus() === "saved"}>
              <p class="mt-2 text-[0.75rem] text-text-muted">Saved to Inbox</p>
            </Show>
            <Show when={captureStatus() === "empty"}>
              <p class="mt-2 text-[0.75rem] text-warning">Write something to capture.</p>
            </Show>
          </form>

          <aside class="rounded-xs border border-border bg-bg-secondary/70 p-4">
            <p class="text-sm font-medium text-text-primary">Agent</p>
            <p class="mt-1 text-xs text-text-secondary">Organize Inbox</p>
            <div class="mt-3 space-y-2 text-[0.75rem] text-text-muted">
              <p class="rounded-xs border border-border bg-bg-primary px-2 py-1.5">
                Setup required
              </p>
              <p class="rounded-xs border border-border bg-bg-primary px-2 py-1.5">Idle</p>
              <p class="rounded-xs border border-border bg-bg-primary px-2 py-1.5">Running</p>
              <p class="rounded-xs border border-border bg-bg-primary px-2 py-1.5">
                Change receipt
              </p>
              <p class="rounded-xs border border-warning-border bg-warning-bg px-2 py-1.5 text-warning">
                Held risky
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export { TodayDashboard };
