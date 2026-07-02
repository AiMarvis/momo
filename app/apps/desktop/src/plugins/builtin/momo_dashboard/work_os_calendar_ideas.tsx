import { For, Show, createSignal } from "solid-js";

import { PlusIcon } from "~/components/icons";

import { createWorkIdea, deleteWorkIdea, workOsState } from "./work_os_store";
import { BUTTON_CLASS, EmptyRow, INPUT_CLASS, SectionHeader } from "./work_os_dashboard_parts";

function IdeaSection() {
  const [ideaText, setIdeaText] = createSignal("");

  function submitIdea(event: SubmitEvent): void {
    event.preventDefault();
    if (!ideaText().trim()) return;
    createWorkIdea(ideaText());
    setIdeaText("");
  }

  return (
    <section class="rounded-xs border border-border bg-bg-secondary/70 p-4">
      <SectionHeader title="Ideas" detail="Small raw entries before they become work" />
      <form class="mt-3 grid gap-2" onSubmit={submitIdea}>
        <textarea
          class={`${INPUT_CLASS} min-h-20 resize-none`}
          aria-label="Idea"
          value={ideaText()}
          placeholder="Quick idea"
          onInput={(event) => setIdeaText(event.currentTarget.value)}
        />
        <button type="submit" class={BUTTON_CLASS}>
          <PlusIcon size={14} />
          <span>Create idea</span>
        </button>
      </form>
      <div class="mt-3 grid gap-2">
        <Show when={workOsState.ideas.length > 0} fallback={<EmptyRow label="No ideas yet" />}>
          <For each={workOsState.ideas}>
            {(idea) => (
              <article class="rounded-xs border border-warning-border bg-warning-bg/20 p-2.5">
                <p class="whitespace-pre-wrap text-sm text-text-primary">{idea.text}</p>
                <div class="mt-2 flex items-center justify-between gap-2">
                  <span class="truncate text-[0.6875rem] text-text-muted">
                    {formatDate(idea.createdAt)}
                  </span>
                  <button
                    type="button"
                    class="rounded-xs border border-border bg-bg-primary px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-ghost-hover hover:text-text-primary"
                    onClick={() => deleteWorkIdea(idea.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            )}
          </For>
        </Show>
      </div>
    </section>
  );
}

function formatDate(value: string): string {
  return value.slice(0, 10);
}

export { IdeaSection };
