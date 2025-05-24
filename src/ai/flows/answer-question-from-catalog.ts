// 'use server';
/**
 * @fileOverview Uses a product catalog to answer questions.
 *
 * - answerQuestionFromCatalog - Answers a question about products.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionFromCatalogInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
  products: z.string().describe('The product catalog as a JSON string.'),
});
export type AnswerQuestionFromCatalogInput =
  z.infer<typeof AnswerQuestionFromCatalogInputSchema>;

const AnswerQuestionFromCatalogOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  confidence: z
    .number()
    .describe(
      'The confidence level in the answer, from 0 (not confident) to 1 (very confident).'
    ),
});
export type AnswerQuestionFromCatalogOutput =
  z.infer<typeof AnswerQuestionFromCatalogOutputSchema>;

export async function answerQuestionFromCatalog(
  input: AnswerQuestionFromCatalogInput
): Promise<AnswerQuestionFromCatalogOutput> {
  return answerQuestionFromCatalogFlow(input);
}

const answerQuestionFromCatalogPrompt = ai.definePrompt({
  name: 'answerQuestionFromCatalogPrompt',
  input: {schema: AnswerQuestionFromCatalogInputSchema},
  output: {schema: AnswerQuestionFromCatalogOutputSchema},
  prompt: `You are a customer support agent answering questions about products.
  Use the following product catalog to answer the question.
  Product Catalog:
  {{products}}

  Question: {{question}}

  Answer the question to the best of your ability. Also, provide a confidence level from 0 to 1 about how confident you are that the answer is correct.
  Confidence: {{(answer.confidence)}}
  Answer: {{(answer.answer)}}`,
});

const answerQuestionFromCatalogFlow = ai.defineFlow(
  {
    name: 'answerQuestionFromCatalogFlow',
    inputSchema: AnswerQuestionFromCatalogInputSchema,
    outputSchema: AnswerQuestionFromCatalogOutputSchema,
  },
  async input => {
    const {output} = await answerQuestionFromCatalogPrompt(input);
    return output!;
  }
);
