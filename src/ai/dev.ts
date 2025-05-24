import { config } from 'dotenv';
config();

import '@/ai/flows/answer-question-from-catalog.ts';
import '@/ai/flows/generate-product-description.ts';
import '@/ai/flows/contextualize-question-answer.ts';