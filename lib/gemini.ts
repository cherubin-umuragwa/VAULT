import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash', // Using 1.5 flash as a stable default, summary said 2.0 but 1.5 is standard
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
  }
});
