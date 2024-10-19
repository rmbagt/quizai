/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createOpenAI } from '@ai-sdk/openai';
import { streamObject } from "ai"
import { z } from 'zod';

const openai = createOpenAI({
    apiKey: process.env.OPEN_API_KEY,
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

const { partialObjectStream } = await streamObject({
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
    prompt: `Generate ${totalQuestion} question about ${topic}`,
});

for await (const partialObject of partialObjectStream) {
    console.clear();
    console.log(partialObject);
}
