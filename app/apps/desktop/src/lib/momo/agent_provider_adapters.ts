import { validateOrganizeInboxAgentPlan } from "./agent_plan_validation";
import type { AgentPlan, AgentPlanValidationResult } from "./agent_plan_types";

interface ProviderPlanRequest {
  readonly sourceNote: string;
  readonly signal?: AbortSignal;
}

type ProviderAdapterOutput =
  | AgentPlan
  | {
      readonly kind: "failed";
      readonly reason: string;
    }
  | {
      readonly kind: "invalid_json";
      readonly errors: readonly string[];
    }
  | {
      readonly kind: "plan";
      readonly value: unknown;
    };

interface CodexPlanAdapter {
  readonly ready: () => Promise<boolean>;
  readonly createPlan: (request: ProviderPlanRequest) => Promise<ProviderAdapterOutput>;
}

interface OpenAiPlanAdapter {
  readonly byokReady: () => Promise<boolean>;
  readonly createPlan: (request: ProviderPlanRequest) => Promise<ProviderAdapterOutput>;
}

interface OpenAiFallbackApprovalRequest {
  readonly reason: string;
}

interface RunAgentProviderAdaptersInput {
  readonly sourceNote: string;
  readonly codex: CodexPlanAdapter;
  readonly openai: OpenAiPlanAdapter;
  readonly askOpenAiFallbackApproval: (request: OpenAiFallbackApprovalRequest) => Promise<boolean>;
  readonly nowIso?: () => string;
  readonly timeoutMs?: number;
}

type ProviderRunResult =
  | AgentPlanValidationResult
  | {
      readonly kind: "failed";
      readonly reason: string;
    };

async function runAgentProviderAdapters(
  input: RunAgentProviderAdaptersInput,
): Promise<AgentPlanValidationResult> {
  if (await input.codex.ready()) {
    const codexResult = await runProvider(input.codex, input.sourceNote, input.timeoutMs);
    if (codexResult.kind !== "failed") return codexResult;

    if (!(await input.openai.byokReady())) return invalid([codexResult.reason]);
    const approved = await input.askOpenAiFallbackApproval({ reason: codexResult.reason });
    if (!approved) return invalid(["OpenAI fallback was not approved"]);

    const fallbackResult = await runProvider(input.openai, input.sourceNote, input.timeoutMs);
    if (fallbackResult.kind === "failed") return invalid([fallbackResult.reason]);
    if (fallbackResult.kind === "invalid") return fallbackResult;

    return validateOrganizeInboxAgentPlan({
      ...fallbackResult.plan,
      provider: {
        ...fallbackResult.plan.provider,
        fallbackFrom: "codex_cli",
        fallbackReason: codexResult.reason,
        fallbackApprovedAt: input.nowIso?.() ?? new Date().toISOString(),
      },
    });
  }

  if (await input.openai.byokReady()) {
    const directOpenAiResult = await runProvider(input.openai, input.sourceNote, input.timeoutMs);
    return directOpenAiResult.kind === "failed"
      ? invalid([directOpenAiResult.reason])
      : directOpenAiResult;
  }

  return invalid(["Agent setup required"]);
}

async function runProvider(
  adapter: Pick<CodexPlanAdapter, "createPlan">,
  sourceNote: string,
  timeoutMs: number | undefined,
): Promise<ProviderRunResult> {
  const result = await createPlanWithTimeout(adapter, { sourceNote }, timeoutMs);
  if (isProviderFailure(result)) return result;
  if (isInvalidJson(result)) return invalid(result.errors);

  const validation = validateOrganizeInboxAgentPlan(isPlanEnvelope(result) ? result.value : result);
  if (validation.kind === "invalid") return validation;
  if (validation.plan.sourceNote !== sourceNote) {
    return invalid(["plan.sourceNote must match requested source note"]);
  }
  return validation;
}

async function createPlanWithTimeout(
  adapter: Pick<CodexPlanAdapter, "createPlan">,
  request: ProviderPlanRequest,
  timeoutMs: number | undefined,
): Promise<ProviderAdapterOutput> {
  if (timeoutMs === undefined) return adapter.createPlan(request);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await Promise.race([
      adapter.createPlan({ ...request, signal: controller.signal }),
      timeoutResult(timeoutMs),
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

function timeoutResult(timeoutMs: number): Promise<ProviderAdapterOutput> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ kind: "failed", reason: `Provider timed out after ${timeoutMs}ms` });
    }, timeoutMs);
  });
}

function isProviderFailure(
  value: ProviderAdapterOutput,
): value is Extract<ProviderAdapterOutput, { kind: "failed" }> {
  return hasProviderKind(value, "failed");
}

function isInvalidJson(
  value: ProviderAdapterOutput,
): value is Extract<ProviderAdapterOutput, { kind: "invalid_json" }> {
  return hasProviderKind(value, "invalid_json");
}

function isPlanEnvelope(
  value: ProviderAdapterOutput,
): value is Extract<ProviderAdapterOutput, { kind: "plan" }> {
  return hasProviderKind(value, "plan");
}

function hasProviderKind(value: ProviderAdapterOutput, kind: string): boolean {
  return typeof value === "object" && value !== null && "kind" in value && value.kind === kind;
}

function invalid(errors: readonly string[]): AgentPlanValidationResult {
  return { kind: "invalid", errors };
}

export { runAgentProviderAdapters };
export type {
  CodexPlanAdapter,
  OpenAiFallbackApprovalRequest,
  OpenAiPlanAdapter,
  ProviderAdapterOutput,
  ProviderPlanRequest,
  RunAgentProviderAdaptersInput,
};
