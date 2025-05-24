'use server';

/**
 * @fileOverview An AI agent that contextualizes questions based on past conversations.
 *
 * - contextualizeQuestionAnswer - A function that contextualizes questions and provides answers based on conversation history.
 * - ContextualizeQuestionAnswerInput - The input type for the contextualizeQuestionAnswer function.
 * - ContextualizeQuestionAnswerOutput - The return type for the contextualizeQuestionAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualizeQuestionAnswerInputSchema = z.object({
  question: z.string().describe('The user question.'),
  conversationHistory: z.string().describe('The past conversation history.'),
});
export type ContextualizeQuestionAnswerInput = z.infer<
  typeof ContextualizeQuestionAnswerInputSchema
>;

const ContextualizeQuestionAnswerOutputSchema = z.object({
  contextualizedQuestion: z
    .string()
    .describe('The contextualized user question.'),
  answer: z.string().describe('The answer to the contextualized question.'),
});
export type ContextualizeQuestionAnswerOutput = z.infer<
  typeof ContextualizeQuestionAnswerOutputSchema
>;

export async function contextualizeQuestionAnswer(
  input: ContextualizeQuestionAnswerInput
): Promise<ContextualizeQuestionAnswerOutput> {
  return contextualizeQuestionAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualizeQuestionAnswerPrompt',
  input: {schema: ContextualizeQuestionAnswerInputSchema},
  output: {schema: ContextualizeQuestionAnswerOutputSchema},
  prompt: `You are an AI customer support agent. A user has asked a question. Consider the past conversation history to better understand the question and provide a relevant answer.

Past Conversation History: {{{conversationHistory}}}

User Question: {{{question}}}

Contextualized Question: (In one sentence, rephrase the user question based on the conversation history.)

Answer: (Answer the contextualized question as accurately and informatively as possible.)`,
});

const contextualizeQuestionAnswerFlow = ai.defineFlow(
  {
    name: 'contextualizeQuestionAnswerFlow',
    inputSchema: ContextualizeQuestionAnswerInputSchema,
    outputSchema: ContextualizeQuestionAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
