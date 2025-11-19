import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const reconocerFruta = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No se ha subido ninguna imagen.",
        mensaje: "Por favor, proporciona una imagen para analizar."
      });
    }

    const imagenBuffer = req.file.buffer;
    const base64Image = imagenBuffer.toString('base64');

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analiza esta imagen y determina si es una fruta. Si lo es, identifícala y proporciona la siguiente información en formato JSON válido:

{
  "es_fruta": true/false,
  "nombre_comun": "nombre de la fruta en español",
  "nombre_cientifico": "nombre científico si lo conoces",
  "color_predominante": "color principal",
  "estado_madurez": "verde/maduro/muy maduro",
  "confianza": "alta/media/baja",
  "descripcion": "breve descripción de lo que ves"
}

Si NO es una fruta, responde:
{
  "es_fruta": false,
  "descripcion": "descripción de lo que ves en la imagen"
}

IMPORTANTE: Responde ÚNICAMENTE con el JSON, sin texto adicional, sin markdown, sin backticks.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: req.file.mimetype
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const textoRespuesta = response.text();

    let resultado;
    try {
      let jsonText = textoRespuesta.trim();
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      resultado = JSON.parse(jsonText);
    } catch (parseError) {
      const jsonMatch = textoRespuesta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          resultado = JSON.parse(jsonMatch[0]);
        } catch (e) {
          resultado = {
            es_fruta: false,
            descripcion: textoRespuesta,
            raw_response: textoRespuesta
          };
        }
      } else {
        resultado = {
          es_fruta: false,
          descripcion: textoRespuesta,
          raw_response: textoRespuesta
        };
      }
    }

    return res.status(200).json({
      exito: true,
      resultado: resultado,
      metadata: {
        modelo: "gemini-2.5-flash",
        proveedor: "Google Gemini",
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error en reconocerFruta:', error);

    if (error.message?.includes('API key')) {
      return res.status(500).json({
        error: "Error de autenticación con Google Gemini",
        mensaje: "La clave API de Gemini no es válida o ha expirado."
      });
    }

    if (error.message?.includes('quota')) {
      return res.status(429).json({
        error: "Límite de solicitudes excedido",
        mensaje: "Has alcanzado el límite de solicitudes de la API de Gemini."
      });
    }

    return res.status(500).json({
      error: "Error procesando la imagen.",
      mensaje: error.message || "Ocurrió un error al analizar la imagen."
    });
  }
};

export const obtenerInfoNutricional = async (req, res) => {
  try {
    const { nombreFruta } = req.body;

    if (!nombreFruta) {
      return res.status(400).json({
        error: "El nombre de la fruta es obligatorio",
        mensaje: "Proporciona el nombre de la fruta para obtener información nutricional."
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Proporciona información nutricional detallada sobre "${nombreFruta}" en formato JSON:
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoRespuesta = response.text();

    let resultado;
    try {
      let jsonText = textoRespuesta.trim();
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      resultado = JSON.parse(jsonText);
    } catch (parseError) {
      const jsonMatch = textoRespuesta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resultado = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No se pudo obtener información nutricional válida");
      }
    }

    return res.status(200).json({
      exito: true,
      resultado: resultado
    });

  } catch (error) {
    console.error('Error en obtenerInfoNutricional:', error);
    return res.status(500).json({
      error: "Error obteniendo información nutricional",
      mensaje: error.message
    });
  }
};
