
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCustomScript = async (topic: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced') => {
  const prompt = `Generate a typing practice script about "${topic}". 
  Difficulty Level: ${difficulty}. 
  - Beginner: Short words, simple punctuation.
  - Intermediate: Mix of case, common punctuation, medium sentences.
  - Advanced: Complex technical terms, rare punctuation, long sentences.
  The script should be between 200 to 400 characters long.
  Return the result as a raw string without any introduction or formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate script. Try again.";
  } catch (error) {
    console.error("Error generating script:", error);
    return "Error occurred while generating content. Please check your connection.";
  }
};

export const getAIPerformanceFeedback = async (wpm: number, accuracy: number, mistakes: number) => {
  const prompt = `Provide a short, motivating, and professional feedback for a user who just finished a typing test.
  Stats: WPM: ${wpm}, Accuracy: ${accuracy}%, Mistakes: ${mistakes}.
  Be encouraging and give 1 specific tip for improvement based on these stats. 
  Keep it under 3 sentences.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Great job! Keep practicing to improve your speed.";
  } catch (error) {
    return "Nice work on completing the test!";
  }
};
