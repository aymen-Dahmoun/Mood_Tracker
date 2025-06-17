import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });

export default function useBotResponse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getBotResponse = async (history, userInput) => {
    setLoading(true);
    setError(null);

    const updatedHistory = [
      ...history,
      { role: "user", parts: [{ text: userInput }] }
    ];

    try {
      const resp = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: JSON.stringify(updatedHistory), // a way to pass chat history
        config: {
          systemInstruction: 
            "You are a compassionate emotional support assistant. Listen empathetically, validate feelings, and give thoughtful, non-medical advice."
        }
      });

      const text = resp.text;
      return {
        response: text,
        updatedHistory: [
          ...updatedHistory,
          { role: "model", parts: [{ text }] }
        ]
      };
    } catch (e) {
      console.error(e);
      setError("Failed to get response");
      return { response: null, updatedHistory: history };
    } finally {
      setLoading(false);
    }
  };

  return { getBotResponse, loading, error };
}

