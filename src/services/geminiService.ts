import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getDesignIdeas(material: string, size: string) {
  const prompt = `I have a piece of ${material} fabric scrap, approximately ${size} in size. 
  Suggest 3 creative upcycling or craft projects I can make with this. 
  For each project, provide a title, a short description of why it works for this size/material, and a few bullet points for steps.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "description", "steps"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error getting design ideas:", error);
    return [];
  }
}
