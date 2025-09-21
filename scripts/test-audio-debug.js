// Script de prueba para el endpoint de debug
// Uso: node scripts/test-audio-debug.js

async function testAudioDebug() {
  console.log('🔍 Probando Endpoint de Debug');
  console.log('==============================');
  
  try {
    // Crear un archivo de audio simulado
    const audioData = new Uint8Array(1000); // 1KB de datos simulados
    const audioBlob = new Blob([audioData], { type: 'audio/webm' });
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'test-audio.webm');
    
    console.log('📤 Enviando audio simulado...');
    
    const response = await fetch('http://localhost:3000/api/chat-audio-debug', {
      method: 'POST',
      body: formData,
    });

    console.log('📊 Estado de respuesta:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa!');
      console.log('📝 Transcripción:', data.transcript);
      console.log('🤖 Respuesta del bot:', data.reply);
      console.log('🔍 Debug info:', data.debug);
      console.log('🎉 El endpoint de debug funciona!');
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

testAudioDebug();
