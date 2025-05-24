"use server";

import type { ConversationTurn } from '@/types';
import { getProducts } from '@/lib/products';
import { contextualizeQuestionAnswer, type ContextualizeQuestionAnswerInput, type ContextualizeQuestionAnswerOutput } from '@/ai/flows/contextualize-question-answer';
import { answerQuestionFromCatalog, type AnswerQuestionFromCatalogInput, type AnswerQuestionFromCatalogOutput } from '@/ai/flows/answer-question-from-catalog';

interface GetBotResponseOutput {
  answer: string;
  confidence?: number;
  error?: string;
}

const formatConversationHistory = (history: ConversationTurn[]): string => {
  if (!history || history.length === 0) return "No conversation history.";
  return history.map(turn => `${turn.role === 'user' ? 'User' : 'Assistant'}: ${turn.content}`).join('\n');
};

export async function getBotResponse(
  currentQuestion: string,
  conversationHistory: ConversationTurn[]
): Promise<GetBotResponseOutput> {
  try {
    const products = await getProducts();
    if (!products || products.length === 0) {
      return { error: "Product catalog is currently unavailable. Please try again later." };
    }
    // Only include essential product details for the AI prompt to keep it concise.
    const productsForAI = products.map(p => ({ 
      name: p.name, 
      features: p.features, 
      category: p.category,
      // price: p.price // Price might not always be relevant for feature questions
    }));
    const productsJsonString = JSON.stringify(productsForAI);

    let questionToAnswer = currentQuestion;
    
    // If conversation history exists, use the contextualization flow.
    // This flow is designed to provide a contextualized question AND an answer.
    // We will use the answer it provides.
    if (conversationHistory.length > 0) {
      const contextualizeInput: ContextualizeQuestionAnswerInput = {
        question: currentQuestion,
        conversationHistory: formatConversationHistory(conversationHistory),
      };
      const contextualizedResult: ContextualizeQuestionAnswerOutput = await contextualizeQuestionAnswer(contextualizeInput);
      // The contextualizeQuestionAnswer flow already attempts to answer the contextualized question.
      // We are using its answer directly. Confidence is not part of this flow's output.
      return {
        answer: contextualizedResult.answer,
        confidence: undefined, 
      };
    }
    
    // If no conversation history, directly use the answerQuestionFromCatalog flow.
    const catalogInput: AnswerQuestionFromCatalogInput = {
      question: questionToAnswer, 
      products: productsJsonString,
    };

    const catalogResponse: AnswerQuestionFromCatalogOutput = await answerQuestionFromCatalog(catalogInput);

    return {
      answer: catalogResponse.answer,
      confidence: catalogResponse.confidence,
    };

  } catch (error: any) {
    console.error("Error getting bot response:", error);
    // Check for specific Genkit error structure if available, otherwise generic message.
    const errorMessage = error.message || "Sorry, I encountered an unexpected issue. Please try asking in a different way or try again later.";
    return { error: errorMessage };
  }
}
