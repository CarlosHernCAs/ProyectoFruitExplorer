import { useState, useRef } from "react";
import { recognizeFruit, getNutritionalInfo } from "../services/recognitionService";

export default function FruitRecognition() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [error, setError] = useState("");
  const [loadingNutrition, setLoadingNutrition] = useState(false);
  const fileInputRef = useRef(null);

  // Manejar selección de imagen
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP).");
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es muy grande. El tamaño máximo es 5MB.");
      return;
    }

    setSelectedImage(file);
    setError("");
    setResult(null);
    setNutritionInfo(null);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Reconocer fruta
  const handleRecognize = async () => {
    if (!selectedImage) {
      setError("Por favor selecciona una imagen primero.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setNutritionInfo(null);

    try {
      const response = await recognizeFruit(selectedImage);

      if (response.exito) {
        setResult(response.resultado);

        // Si es una fruta, obtener info nutricional automáticamente
        if (response.resultado.es_fruta && response.resultado.nombre_comun) {
          loadNutritionalInfo(response.resultado.nombre_comun);
        }
      } else {
        setError("No se pudo analizar la imagen. Intenta de nuevo.");
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar información nutricional
  const loadNutritionalInfo = async (fruitName) => {
    setLoadingNutrition(true);
    try {
      const response = await getNutritionalInfo(fruitName);
      if (response.exito) {
        setNutritionInfo(response.resultado);
      }
    } catch (err) {
      console.error("Error cargando info nutricional:", err);
    } finally {
      setLoadingNutrition(false);
    }
  };

  // Limpiar y empezar de nuevo
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setNutritionInfo(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fruit-container">
      <div className="recognition-header">
        <h1 className="fruit-title">🔍 Reconocimiento de Frutas con IA</h1>
        <p className="fruit-subtitle">
          Sube una imagen de una fruta y nuestra IA te dirá qué es, su estado de madurez y más.
        </p>
      </div>

      {/* Área de carga de imagen */}
      <div className="recognition-upload-section">
        <div className="upload-area">
          {!imagePreview ? (
            <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">📷</div>
              <p className="upload-text">Haz clic o arrastra una imagen aquí</p>
              <p className="upload-hint">JPEG, PNG, GIF o WEBP (máx. 5MB)</p>
            </div>
          ) : (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button className="btn-remove" onClick={handleReset}>
                ✕ Cambiar imagen
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />
        </div>

        {selectedImage && !result && (
          <button
            className="btn btn-primary btn-large"
            onClick={handleRecognize}
            disabled={loading}
          >
            {loading ? "🔄 Analizando..." : "🔍 Reconocer Fruta"}
          </button>
        )}
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Resultados */}
      {result && (
        <div className="recognition-results">
          {result.es_fruta ? (
            <>
              <div className="result-card success">
                <div className="result-header">
                  <h2>✅ ¡Fruta Identificada!</h2>
                  <span className={`confidence-badge ${result.confianza}`}>
                    Confianza: {result.confianza}
                  </span>
                </div>

                <div className="result-content">
                  <div className="result-row">
                    <div className="result-item">
                      <span className="result-label">Nombre común:</span>
                      <span className="result-value">{result.nombre_comun}</span>
                    </div>

                    {result.nombre_cientifico && (
                      <div className="result-item">
                        <span className="result-label">Nombre científico:</span>
                        <span className="result-value scientific-name">{result.nombre_cientifico}</span>
                      </div>
                    )}
                  </div>

                  <div className="result-row">
                    <div className="result-item">
                      <span className="result-label">Color predominante:</span>
                      <span className="result-value">
                        <span className="color-indicator" style={{ backgroundColor: result.color_predominante }}></span>
                        {result.color_predominante}
                      </span>
                    </div>

                    <div className="result-item">
                      <span className="result-label">Estado de madurez:</span>
                      <span className={`result-value maturity-${result.estado_madurez}`}>
                        {result.estado_madurez === 'verde' && '🟢 Verde'}
                        {result.estado_madurez === 'maduro' && '🟡 Maduro'}
                        {result.estado_madurez === 'muy maduro' && '🟠 Muy maduro'}
                        {!['verde', 'maduro', 'muy maduro'].includes(result.estado_madurez) && result.estado_madurez}
                      </span>
                    </div>
                  </div>

                  {result.descripcion && (
                    <div className="result-description">
                      <span className="result-label">Descripción:</span>
                      <p>{result.descripcion}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Información Nutricional */}
              {loadingNutrition && (
                <div className="nutrition-loading">
                  <p>🔄 Cargando información nutricional...</p>
                </div>
              )}

              {nutritionInfo && (
                <div className="result-card nutrition">
                  <h3>🍎 Información Nutricional</h3>
                  <p className="nutrition-portion">Por {nutritionInfo.porcion}</p>

                  <div className="nutrition-grid">
                    <div className="nutrition-item">
                      <span className="nutrition-label">Calorías</span>
                      <span className="nutrition-value">{nutritionInfo.calorias}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Carbohidratos</span>
                      <span className="nutrition-value">{nutritionInfo.carbohidratos}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Proteínas</span>
                      <span className="nutrition-value">{nutritionInfo.proteinas}</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-label">Grasas</span>
                      <span className="nutrition-value">{nutritionInfo.grasas}</span>
                    </div>
                    {nutritionInfo.fibra && (
                      <div className="nutrition-item">
                        <span className="nutrition-label">Fibra</span>
                        <span className="nutrition-value">{nutritionInfo.fibra}</span>
                      </div>
                    )}
                  </div>

                  {nutritionInfo.vitaminas_principales && nutritionInfo.vitaminas_principales.length > 0 && (
                    <div className="nutrition-section">
                      <h4>Vitaminas principales:</h4>
                      <ul className="nutrition-list">
                        {nutritionInfo.vitaminas_principales.map((vitamin, idx) => (
                          <li key={idx}>{vitamin}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {nutritionInfo.minerales_principales && nutritionInfo.minerales_principales.length > 0 && (
                    <div className="nutrition-section">
                      <h4>Minerales principales:</h4>
                      <ul className="nutrition-list">
                        {nutritionInfo.minerales_principales.map((mineral, idx) => (
                          <li key={idx}>{mineral}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {nutritionInfo.beneficios && nutritionInfo.beneficios.length > 0 && (
                    <div className="nutrition-section">
                      <h4>Beneficios para la salud:</h4>
                      <ul className="benefits-list">
                        {nutritionInfo.beneficios.map((benefit, idx) => (
                          <li key={idx}>✓ {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="result-card error">
              <h2>❌ No es una fruta</h2>
              <p>{result.descripcion || "La imagen no contiene una fruta reconocible."}</p>
            </div>
          )}

          <button className="btn btn-secondary" onClick={handleReset}>
            🔄 Analizar otra imagen
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div className="recognition-info">
        <h3>ℹ️ ¿Cómo funciona?</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-number">1</span>
            <p>Sube una foto clara de la fruta</p>
          </div>
          <div className="info-item">
            <span className="info-number">2</span>
            <p>Nuestra IA analiza la imagen</p>
          </div>
          <div className="info-item">
            <span className="info-number">3</span>
            <p>Recibe información detallada al instante</p>
          </div>
        </div>
      </div>
    </div>
  );
}
