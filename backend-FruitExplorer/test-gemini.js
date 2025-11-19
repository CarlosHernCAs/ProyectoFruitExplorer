import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("\n🧪 Test de Conexión con Google Gemini");
console.log("=====================================\n");

if (!GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY no está configurada en .env");
  process.exit(1);
}

console.log("✅ API Key encontrada:", GEMINI_API_KEY.substring(0, 20) + "...");

async function testGeminiText() {
  try {
    console.log("\n📝 Test 1: Gemini Pro (Texto)");
    console.log("----------------------------");

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "Di 'Hola desde Gemini' en español de forma breve";
    console.log("📤 Enviando prompt:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Respuesta recibida:", text);
    console.log("✅ Test de texto completado exitosamente\n");

    return true;
  } catch (error) {
    console.error("❌ Error en test de texto:", error.message);
    return false;
  }
}

async function testGeminiNutrition() {
  try {
    console.log("\n🍎 Test 2: Información Nutricional");
    console.log("----------------------------------");

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Proporciona información nutricional detallada sobre "Manzana" en formato JSON:
{
  "nombre": "nombre de la fruta",
  "porcion": "100g",
  "calorias": número,
  "carbohidratos": "Xg",
  "proteinas": "Xg",
  "grasas": "Xg",
  "fibra": "Xg",
  "vitaminas_principales": ["vitamina1", "vitamina2"],
  "minerales_principales": ["mineral1", "mineral2"],
  "beneficios": ["beneficio1", "beneficio2", "beneficio3"]
}

Responde ÚNICAMENTE con el JSON, sin texto adicional, sin markdown, sin backticks.`;

    console.log("📤 Solicitando información nutricional de Manzana...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Limpiar markdown
    text = text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');

    console.log("📥 Respuesta recibida (raw):");
    console.log(text.substring(0, 200) + "...");

    // Intentar parsear JSON
    const json = JSON.parse(text);
    console.log("\n✅ JSON parseado correctamente:");
    console.log(JSON.stringify(json, null, 2));
    console.log("\n✅ Test de información nutricional completado exitosamente\n");

    return true;
  } catch (error) {
    console.error("❌ Error en test de nutrición:", error.message);
    if (error.message.includes("JSON")) {
      console.error("   Respuesta no era JSON válido");
    }
    return false;
  }
}

async function runTests() {
  console.log("🚀 Iniciando pruebas de Google Gemini...\n");

  const test1 = await testGeminiText();
  const test2 = await testGeminiNutrition();

  console.log("\n=====================================");
  console.log("📊 Resumen de Pruebas");
  console.log("=====================================");
  console.log("Test 1 (Texto):     ", test1 ? "✅ PASÓ" : "❌ FALLÓ");
  console.log("Test 2 (Nutrición): ", test2 ? "✅ PASÓ" : "❌ FALLÓ");
  console.log("=====================================\n");

  if (test1 && test2) {
    console.log("🎉 ¡Todos los tests pasaron! La integración con Gemini funciona correctamente.");
    console.log("\n📝 Siguiente paso: Reinicia el servidor backend con:");
    console.log("   npm run dev");
    console.log("\n   Luego prueba el reconocimiento de frutas en:");
    console.log("   http://localhost:5173/recognition\n");
  } else {
    console.log("⚠️ Algunos tests fallaron. Revisa los errores arriba.\n");
    process.exit(1);
  }
}

runTests();
