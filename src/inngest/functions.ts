import { generateText } from "ai";
import { inngest } from "./client";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import {createOpenAI} from '@ai-sdk/openai'
import {anthropic,createAnthropic} from '@ai-sdk/anthropic'
export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);

const googleModel = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
const openAiModel = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const anthropicModel = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})



export const execute = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {
        const { steps } = await step.ai.wrap('gemini-generate-text', generateText, {
            model: googleModel('gemini-2.5-flash'),
            system: 'You are a helpful assistant',
            prompt: 'What is the capital of France?',
        })
        const { steps: openAiSteps } = await step.ai.wrap('openai-generate-text', generateText, {
            model: openAiModel('gpt-4o-mini'),
            system: 'You are a helpful assistant',
            prompt: 'What is the capital of France?',
        })
        const { steps: anthropicSteps } = await step.ai.wrap('anthropic-generate-text', generateText, {
            model: anthropicModel('claude-3-5-sonnet-20240620'),
            system: 'You are a helpful assistant',
            prompt: 'What is the capital of France?',
        })
        return {
            gemini: steps,
            openAi: openAiSteps,
            anthropic: anthropicSteps,
        };
    },
);