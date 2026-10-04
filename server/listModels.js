import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function listModels() {
  try {
    const models = await ai.models.list();

    console.log("Models available for generateContent:\n");

    for await (const model of models) {
      if (model.supportedActions?.includes("generateContent")) {
        console.log(model.name);
      }
    }
  } catch (error) {
    console.error("Unable to list models:", error.message);
  }
}

listModels();
