import type { NodeExecutor } from "@/features/executions/types";
type MannualTriggerData = Record<string,unknown>;

export const manualTriggerExecutor:NodeExecutor<MannualTriggerData> = async ({ data, nodeId, context, step }) => {
    const result = await step.run('manual-trigger',async ()=>context)
    return result;
}
