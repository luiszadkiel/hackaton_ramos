// Script de prueba para el audio corregido
// Uso: node scripts/test-audio-fixed.js

async function testAudioFixed() {
  console.log('🧪 Probando audio corregido...');
  console.log('==============================');
  
  try {
    // Crear un archivo de audio simulado
    const audioData = new Uint8Array(1000);
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
      console.log('✅ ¡Funciona!');
      console.log('📝 Transcripción:', data.transcript);
      console.log('🤖 Respuesta:', data.reply);
      console.log('🎵 Audio generado:', data.audio ? 'Sí' : 'No');
      console.log('🔍 Debug info:', data.debug);
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo: npm run dev');
  }
}

testAudioFixed();
