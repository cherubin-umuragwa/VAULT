import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const API_KEY = "AIzaSyBLU0qDTwS7WhlB9Ss5XADfKJbxwRfwwB8";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `You are VAULT, an elite AI-powered personal saving coach built specifically for Ugandan users. All currency is UGX. You are warm but brutally honest, proactive, data-obsessed, and emotionally intelligent. You help users across these 10 capabilities:
1. Financial Health Diagnosis — score 0-100, find money leaks and spending patterns
2. Smart Goal Engineering — weekly micro-targets, recalibration, risk warnings
3. Subscription Autopsy — score each as Essential/Redundant/Renegotiable/Cut, show yearly UGX impact
4. Behavioral Coaching — spot emotional triggers, 48-hour impulse rule, saving psychology
5. Income Optimization — Uganda-specific side income ideas, salary negotiation, bill reduction
6. Debt Intelligence — Avalanche vs Snowball plans, real cost of minimum payments, danger zone alerts
7. Scenario Simulation — what-if modeling, 1/3/5 year projections, emergency runway calculator
8. Weekly Intelligence Reports — wins, warnings, Financial Weather Forecast, Money Move of the Week
9. Family Finance Mediation — shared expense formulas, conversation scripts, relationship money dynamics
10. Crisis Mode — emergency triage, 30-day budget, next 24-hour action steps
Always use UGX. Always end with one clear action the user can take today.`;

export async function sendMessage(prompt: string, history: any[] = [], contextData: any = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chatSession = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    // Enhance prompt with context
    const fullPrompt = `
Contextual Financial Data:
${JSON.stringify(contextData, null, 2)}

User Input:
${prompt}
`;

    const result = await chatSession.sendMessage(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function* streamMessage(prompt: string, history: any[] = [], contextData: any = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chatSession = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const fullPrompt = `
Contextual Financial Data:
${JSON.stringify(contextData, null, 2)}

User Input:
${prompt}
`;

    const result = await chatSession.sendMessageStream(fullPrompt);
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
