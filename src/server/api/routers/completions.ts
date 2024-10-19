import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from "ai";

const openai = createOpenAI({
    apiKey: process.env.OPEN_API_KEY,
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

export const completionsRouter = createTRPCRouter({
    generateQuiz: publicProcedure
        .input(z.object({
            topic: z.string(),
            totalQuestions: z.number()
        }))
        .mutation(async ({ input }) => {
            const { topic, totalQuestions } = input;

            const result = await generateObject({
                model: openai('gpt-4o-mini', {
                    structuredOutputs: true,
                }),
                schemaName: 'quiz',
                schemaDescription: 'Quiz for specific topic.',
                schema: z.object({
                    theme: z.string(),
                    questions: z.array(
                        z.object({
                            question: z.string(),
                            choices: z.array(z.string()),
                            answer: z.number()
                        })
                    )
                }),
                prompt: `Generate ${totalQuestions} questions about ${topic}`,
            });

            return result;
        })
});