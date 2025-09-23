// Script de prueba para el endpoint de chat con audio
// Uso: node scripts/test-audio-api.js

const fs = require('fs');
const path = require('path');

async function testAudioAPI() {
  const testAudioPath = path.join(__dirname, '../test-audio.webm');
  
  // Verificar si existe un archivo de audio de prueba
  if (!fs.existsSync(testAudioPath)) {
    console.log('❌ No se encontró archivo de prueba test-audio.webm');
    console.log('💡 Crea un archivo de audio WebM para probar el endpoint');
    return;
  }

  try {
    const formData = new FormData();
    const audioBlob = new Blob([fs.readFileSync(testAudioPath)], { type: 'audio/webm' });
    formData.append('file', audioBlob, 'test-audio.webm');

    console.log('🚀 Enviando audio al endpoint...');
    
    const response = await fetch('http://localhost:3000/api/chat-audio', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      const transcript = response.headers.get('X-Transcript');
      const replyText = response.headers.get('X-Reply-Text');
      
      console.log('✅ Respuesta exitosa!');
      console.log('📝 Transcript:', transcript);
      console.log('🤖 Respuesta:', replyText);
      console.log('🎵 Audio recibido:', audioBuffer.byteLength, 'bytes');
      
      // Guardar el audio de respuesta
      const outputPath = path.join(__dirname, '../test-response.wav');
      fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
      console.log('💾 Audio guardado en:', outputPath);
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  testAudioAPI();
}

module.exports = { testAudioAPI };




