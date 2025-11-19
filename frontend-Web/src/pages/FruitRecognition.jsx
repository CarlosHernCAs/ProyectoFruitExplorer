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
    setError(null);
    setResults(null);
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

  // Analizar imagen
  const analyzeImage = async () => {
    if (!selectedImage) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      // Comprimir imagen antes de enviar
      console.log('Comprimiendo imagen...');
      const compressedBlob = await compressImage(selectedImage, 1024, 1024, 0.8);
      const compressedFile = new File([compressedBlob], selectedImage.name, {
        type: 'image/jpeg',
      });

      console.log(`Tamaño original: ${(selectedImage.size / 1024).toFixed(2)}KB`);
      console.log(`Tamaño comprimido: ${(compressedFile.size / 1024).toFixed(2)}KB`);

      // Enviar al backend
      console.log('Enviando imagen al servidor...');
      const response = await recognizeFruit(compressedFile);

      console.log('Resultado del reconocimiento:', response);
      setResults(response);
    } catch (err) {
      console.error('Error al analizar imagen:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error al analizar la imagen. Por favor intenta de nuevo.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reiniciar
  const reset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Ver detalles de la fruta
  const viewFruitDetails = (fruitSlug) => {
    navigate(`/fruits/${fruitSlug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Reconocimiento de Frutas 🍎
          </h1>
          <p className="text-lg text-gray-600">
            Toma una foto o sube una imagen para identificar la fruta
          </p>
        </div>

        {/* Cámara Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full p-6 animate-scale-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Capturar Foto</h3>
                <button
                  onClick={closeCamera}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              {cameraError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  <AlertCircle className="inline mr-2" />
                  {cameraError}
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg bg-black"
                  />
                  <div className="mt-4 flex justify-center gap-4">
                    <Button
                      onClick={capturePhoto}
                      variant="primary"
                      size="lg"
                      icon={Camera}
                    >
                      Capturar Foto
                    </Button>
                    <Button
                      onClick={closeCamera}
                      variant="outline"
                      size="lg"
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Área de carga de imagen */}
        {!selectedImage && !isCameraOpen && (
          <Card variant="elevated" className="animate-slide-up">
            <CardBody>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Opción 1: Tomar foto */}
                <div
                  onClick={openCamera}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                >
                  <Camera
                    size={64}
                    className="mx-auto text-gray-400 group-hover:text-primary-600 transition-colors mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Tomar Foto
                  </h3>
                  <p className="text-sm text-gray-500">
                    Usa tu cámara para capturar una imagen
                  </p>
                </div>

                {/* Opción 2: Subir archivo */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                >
                  <Upload
                    size={64}
                    className="mx-auto text-gray-400 group-hover:text-primary-600 transition-colors mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Subir Imagen
                  </h3>
                  <p className="text-sm text-gray-500">
                    Selecciona una imagen desde tu dispositivo
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Para mejores resultados, asegúrate de que la fruta esté bien iluminada y en foco.
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Vista previa y análisis */}
        {selectedImage && (
          <div className="space-y-6 animate-fade-in">
            {/* Imagen seleccionada */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Imagen Seleccionada</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-lg max-h-96 object-contain bg-gray-100"
                  />
                  <button
                    onClick={reset}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-4 flex gap-4">
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    loading={isAnalyzing}
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    {isAnalyzing ? 'Analizando...' : 'Analizar Imagen'}
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 animate-slide-down">
                <AlertCircle className="inline mr-2" />
                {error}
              </div>
            )}

            {/* Resultados */}
            {results && (
              <Card variant="elevated" className="animate-slide-up">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={24} />
                    <CardTitle>Resultados del Reconocimiento</CardTitle>
                  </div>
                </CardHeader>
                <CardBody>
                  {results.fruit ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        {results.fruit.image_url && (
                          <img
                            src={results.fruit.image_url}
                            alt={results.fruit.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {results.fruit.name}
                          </h3>
                          {results.fruit.scientific_name && (
                            <p className="text-sm text-gray-500 italic mb-2">
                              {results.fruit.scientific_name}
                            </p>
                          )}
                          {results.confidence && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${results.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {(results.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {results.fruit.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {results.fruit.description}
                        </p>
                      )}

                      <Button
                        onClick={() => viewFruitDetails(results.fruit.slug)}
                        variant="primary"
                        fullWidth
                      >
                        Ver Detalles Completos
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto text-yellow-500 mb-4" size={48} />
                      <h3 className="text-lg font-semibold mb-2">
                        No se pudo identificar la fruta
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Intenta con una imagen más clara o con mejor iluminación
                      </p>
                      <Button onClick={reset} variant="outline">
                        Intentar de Nuevo
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        )}
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
