import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { recognizeFruit, compressImage } from '../services/recognitionService';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';

export default function FruitRecognition() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Estados
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Limpiar stream de cámara al desmontar
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Abrir cámara
  const openCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Cámara trasera en móviles
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      setIsCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setCameraError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  // Cerrar cámara
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // Capturar foto desde cámara
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Configurar canvas con las dimensiones del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar frame actual del video en el canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Convertir canvas a blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        handleImageSelected(file);
        closeCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  // Manejar selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelected(file);
    }
  };

  // Procesar imagen seleccionada
  const handleImageSelected = (file) => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 10MB');
      return;
    }

    setSelectedImage(file);
    setError(null);
    setResults(null);

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
      </div>
    </div>
  );
}
