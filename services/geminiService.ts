import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTemplateContent = async (topic: string, tone: string): Promise<string> => {
  if (!apiKey) return "Error: API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short WhatsApp message template for a business. 
      Topic: ${topic}. 
      Tone: ${tone}.
      Use placeholders like {name}, {service}, {time}, {link} where appropriate.
      Keep it under 100 words. Do not include subject lines or preambles, just the message body.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "Failed to generate template. Please try again.";
  }
};

export const suggestReply = async (conversationHistory: string): Promise<string> => {
  if (!apiKey) return "Error: API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful customer support agent. Suggest a short, professional reply to the following conversation context:
      ${conversationHistory}
      
      Reply only with the suggested text.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return "Could not suggest a reply.";
  }
};
