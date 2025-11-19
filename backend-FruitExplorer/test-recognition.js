/**
 * Script de prueba para la API de reconocimiento de frutas
 *
 * Para ejecutar:
 * 1. Asegúrate de tener el servidor corriendo (npm run dev)
 * 2. Ejecuta: node test-recognition.js
 */

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'http://localhost:4000/api';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test 1: Información nutricional
async function testNutritionInfo() {
  log('\n🧪 Test 1: Información Nutricional', 'cyan');
  log('='.repeat(50), 'cyan');

  try {
    const response = await fetch(`${API_BASE_URL}/recognition/nutrition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombreFruta: 'Manzana'
      })
    });

    const data = await response.json();

    if (data.exito) {
      log('✅ Test exitoso!', 'green');
      log('\nInformación nutricional recibida:', 'blue');
      console.log(JSON.stringify(data.resultado, null, 2));
    } else {
      log('❌ Test fallido', 'red');
      console.log(data);
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
  }
}

// Test 2: Reconocimiento de fruta desde URL de imagen
async function testFruitRecognitionFromURL() {
  log('\n🧪 Test 2: Reconocimiento de Fruta (ejemplo sin imagen real)', 'cyan');
  log('='.repeat(50), 'cyan');

  log('⚠️  Para probar con una imagen real:', 'yellow');
  log('   1. Guarda una imagen de fruta en el directorio del proyecto', 'yellow');
  log('   2. Actualiza la ruta en el código', 'yellow');
  log('   3. Descomenta la sección de código correspondiente\n', 'yellow');

  // Ejemplo de código para probar con imagen real:
  /*
  const imagePath = path.join(process.cwd(), 'test-fruit.jpg');

  if (!fs.existsSync(imagePath)) {
    log(`❌ No se encontró la imagen en: ${imagePath}`, 'red');
    log('   Coloca una imagen llamada "test-fruit.jpg" en el directorio raíz', 'yellow');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('imagen', fs.createReadStream(imagePath));

    const response = await fetch(`${API_BASE_URL}/recognition/fruit`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const data = await response.json();

    if (data.exito) {
      log('✅ Test exitoso!', 'green');
      log('\nResultado del reconocimiento:', 'blue');
      console.log(JSON.stringify(data.resultado, null, 2));

      if (data.metadata) {
        log('\nMetadata:', 'blue');
        console.log(`- Modelo: ${data.metadata.modelo}`);
        console.log(`- Tokens usados: ${data.metadata.tokens_usados}`);
        console.log(`- Timestamp: ${data.metadata.timestamp}`);
      }
    } else {
      log('❌ Test fallido', 'red');
      console.log(data);
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
  }
  */
}

// Test 3: Manejo de errores - sin imagen
async function testErrorHandling() {
  log('\n🧪 Test 3: Manejo de Errores (sin imagen)', 'cyan');
  log('='.repeat(50), 'cyan');

  try {
    const formData = new FormData();

    const response = await fetch(`${API_BASE_URL}/recognition/fruit`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const data = await response.json();

    if (response.status === 400 && data.error) {
      log('✅ Test exitoso! Error manejado correctamente', 'green');
      log(`\nRespuesta de error esperada:`, 'blue');
      console.log(JSON.stringify(data, null, 2));
    } else {
      log('❌ Test fallido - Se esperaba un error 400', 'red');
      console.log(data);
    }
  } catch (error) {
    log(`❌ Error inesperado: ${error.message}`, 'red');
  }
}

// Ejecutar todos los tests
async function runAllTests() {
  log('\n🚀 Iniciando Tests de API de Reconocimiento de Frutas', 'cyan');
  log('='.repeat(50), 'cyan');

  // Verificar que el servidor esté corriendo
  try {
    await fetch(API_BASE_URL);
  } catch (error) {
    log('\n❌ Error: No se puede conectar al servidor', 'red');
    log('   Asegúrate de que el servidor esté corriendo en http://localhost:4000', 'yellow');
    log('   Ejecuta: npm run dev', 'yellow');
    process.exit(1);
  }

  // Ejecutar tests
  await testNutritionInfo();
  await testFruitRecognitionFromURL();
  await testErrorHandling();

  log('\n✨ Tests completados!', 'green');
  log('='.repeat(50), 'cyan');
  log('\n📝 Siguiente paso:', 'blue');
  log('   1. Configura tu OPENAI_API_KEY en el archivo .env', 'yellow');
  log('   2. Coloca una imagen de prueba (test-fruit.jpg)', 'yellow');
  log('   3. Descomenta el código en testFruitRecognitionFromURL()', 'yellow');
  log('   4. Ejecuta de nuevo: node test-recognition.js\n', 'yellow');
}

// Ejecutar
runAllTests().catch(console.error);
