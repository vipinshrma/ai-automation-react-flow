import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/tiggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";

export const executorRegistory:Record<NodeType,NodeExecutor>  = {
    [NodeType.MANNUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]:httpRequestExecutor
}

export const getExecutor = (type:NodeType):NodeExecutor =>{
    const executor = executorRegistory[type]
    if(!executor){
        throw new Error(`No Executor found for node type: ${type}`)
    }

    return executor
}