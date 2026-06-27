import { describe, expect, it, vi } from "vitest";

import { runAgentProviderAdapters, type ProviderAdapterOutput } from "./agent_provider_adapters";
import type { AgentPlan, AgentProviderMetadata } from "./agent_plan";

const SOURCE_NOTE = "Inbox/raw.md";
const FALLBACK_APPROVED_AT = "2026-06-28T00:00:00.000Z";

function validPlan(provider: AgentProviderMetadata): AgentPlan {
  return {
    summary: "Created safe inbox follow-up.",
    sourceNote: SOURCE_NOTE,
    provider,
    creates: [
      {
        kind: "managed_task",
        title: "Send follow-up",
        sourceNote: SOURCE_NOTE,
        status: "todo",
        path: "Tasks/send-follow-up.md",
        important: true,
      },
    ],
    updates: [],
    approvalRequired: [],
  };
}

describe("agent provider adapters", () => {
  it("selects fake ready Codex first and does not call OpenAI", async () => {
    const askApproval = vi.fn(async () => false);
    const codexPlan = vi.fn(async () =>
      validPlan({
        kind: "codex_cli",
        name: "codex",
      }),
    );
    const openAiPlan = vi.fn(async () =>
      validPlan({
        kind: "openai_api",
        name: "openai",
      }),
    );

    const result = await runAgentProviderAdapters({
      sourceNote: SOURCE_NOTE,
      codex: {
        ready: async () => true,
        createPlan: codexPlan,
      },
      openai: {
        byokReady: async () => true,
        createPlan: openAiPlan,
      },
      askOpenAiFallbackApproval: askApproval,
      nowIso: () => FALLBACK_APPROVED_AT,
    });

    expect(result).toMatchObject({
      kind: "valid",
      plan: {
        provider: {
          kind: "codex_cli",
          name: "codex",
        },
      },
    });
    expect(codexPlan).toHaveBeenCalledOnce();
    expect(openAiPlan).not.toHaveBeenCalled();
    expect(askApproval).not.toHaveBeenCalled();
  });

  it("asks approval when Codex fails with BYOK ready and decline does not call OpenAI", async () => {
    const askApproval = vi.fn(async () => false);
    const openAiPlan = vi.fn(async () =>
      validPlan({
        kind: "openai_api",
        name: "openai",
      }),
    );

    const result = await runAgentProviderAdapters({
      sourceNote: SOURCE_NOTE,
      codex: {
        ready: async () => true,
        createPlan: vi.fn(async () => failedCodexPlan()),
      },
      openai: {
        byokReady: async () => true,
        createPlan: openAiPlan,
      },
      askOpenAiFallbackApproval: askApproval,
      nowIso: () => FALLBACK_APPROVED_AT,
    });

    expect(askApproval).toHaveBeenCalledOnce();
    expect(openAiPlan).not.toHaveBeenCalled();
    expect(result).toEqual({
      kind: "invalid",
      errors: ["OpenAI fallback was not approved"],
    });
  });

  it("uses direct OpenAI when Codex is not ready without fallback metadata", async () => {
    const askApproval = vi.fn(async () => false);
    const codexPlan = vi.fn(async () => failedCodexPlan());

    const result = await runAgentProviderAdapters({
      sourceNote: SOURCE_NOTE,
      codex: {
        ready: async () => false,
        createPlan: codexPlan,
      },
      openai: {
        byokReady: async () => true,
        createPlan: vi.fn(async () =>
          validPlan({
            kind: "openai_api",
            name: "openai",
          }),
        ),
      },
      askOpenAiFallbackApproval: askApproval,
      nowIso: () => FALLBACK_APPROVED_AT,
    });

    expect(result).toMatchObject({
      kind: "valid",
      plan: {
        provider: {
          kind: "openai_api",
          name: "openai",
        },
      },
    });
    if (result.kind === "valid") {
      expect(result.plan.provider.fallbackFrom).toBeUndefined();
      expect(result.plan.provider.fallbackReason).toBeUndefined();
      expect(result.plan.provider.fallbackApprovedAt).toBeUndefined();
    }
    expect(codexPlan).not.toHaveBeenCalled();
    expect(askApproval).not.toHaveBeenCalled();
  });

  it("uses OpenAI after approval and returns provider metadata with fallback details", async () => {
    const askApproval = vi.fn(async () => true);

    const result = await runAgentProviderAdapters({
      sourceNote: SOURCE_NOTE,
      codex: {
        ready: async () => true,
        createPlan: vi.fn(async () => failedCodexPlan()),
      },
      openai: {
        byokReady: async () => true,
        createPlan: vi.fn(async () =>
          validPlan({
            kind: "openai_api",
            name: "openai",
          }),
        ),
      },
      askOpenAiFallbackApproval: askApproval,
      nowIso: () => FALLBACK_APPROVED_AT,
    });

    expect(result).toMatchObject({
      kind: "valid",
      plan: {
        provider: {
          kind: "openai_api",
          name: "openai",
          fallbackFrom: "codex_cli",
          fallbackReason: "Codex exited before returning a plan.",
          fallbackApprovedAt: FALLBACK_APPROVED_AT,
        },
      },
    });
  });

  it("returns invalid validation for invalid JSON and schema without vault mutation shape", async () => {
    const providerResults: readonly ProviderAdapterOutput[] = [
      {
        kind: "invalid_json",
        errors: ["Provider response was not valid JSON"],
      },
      {
        kind: "plan",
        value: {
          ...validPlan({
            kind: "codex_cli",
            name: "codex",
          }),
          creates: [{ kind: "file_patch", path: "Tasks/x.md" }],
        },
      },
    ];
    for (const providerResult of providerResults) {
      const result = await runAgentProviderAdapters({
        sourceNote: SOURCE_NOTE,
        codex: {
          ready: async () => true,
          createPlan: vi.fn(async () => providerResult),
        },
        openai: {
          byokReady: async () => false,
          createPlan: vi.fn(async () =>
            validPlan({
              kind: "openai_api",
              name: "openai",
            }),
          ),
        },
        askOpenAiFallbackApproval: vi.fn(async () => false),
        nowIso: () => FALLBACK_APPROVED_AT,
      });

      expect(result.kind).toBe("invalid");
      expect(result).not.toHaveProperty("safeChanges");
      expect(result).not.toHaveProperty("approvalRequired");
      expect(result).not.toHaveProperty("vaultChanges");
    }
  });

  it("aborts a slow provider and returns an invalid timeout summary", async () => {
    let seenSignal: AbortSignal | undefined;

    const result = await runAgentProviderAdapters({
      sourceNote: SOURCE_NOTE,
      codex: {
        ready: async () => true,
        createPlan: ({ signal }) => {
          seenSignal = signal;
          return new Promise<ProviderAdapterOutput>(() => {});
        },
      },
      openai: {
        byokReady: async () => false,
        createPlan: vi.fn(async () =>
          validPlan({
            kind: "openai_api",
            name: "openai",
          }),
        ),
      },
      askOpenAiFallbackApproval: vi.fn(async () => false),
      timeoutMs: 1,
    });

    expect(result).toEqual({
      kind: "invalid",
      errors: ["Provider timed out after 1ms"],
    });
    expect(seenSignal?.aborted).toBe(true);
  });
});

function failedCodexPlan(): ProviderAdapterOutput {
  return {
    kind: "failed",
    reason: "Codex exited before returning a plan.",
  };
}
