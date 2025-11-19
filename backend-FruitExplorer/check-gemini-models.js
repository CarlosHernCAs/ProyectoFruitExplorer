import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log("\n🔍 Listando modelos disponibles de Gemini...\n");

async function listModels() {
  try {
    const models = await genAI.listModels();

    console.log("📋 Modelos disponibles:\n");

    for await (const model of models) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🤖 Modelo:", model.name);
      console.log("📝 Display Name:", model.displayName);
      console.log("📄 Descripción:", model.description);
      console.log("✅ Métodos soportados:", model.supportedGenerationMethods?.join(", "));
      console.log("");
    }

  } catch (error) {
    console.error("❌ Error listando modelos:", error.message);
  }
}

listModels();
