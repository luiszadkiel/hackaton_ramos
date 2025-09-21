// Script de prueba simple para el endpoint de chat con audio
// Uso: node scripts/test-simple.js

async function testSimple() {
  try {
    console.log('🧪 Probando endpoint con mensaje de texto...');
    
    const response = await fetch('http://localhost:3000/api/chat-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hola, necesito información sobre lavado de ropa'
      }),
    });

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      const transcript = response.headers.get('X-Transcript');
      const replyText = response.headers.get('X-Reply-Text');
      
      console.log('✅ Respuesta exitosa!');
      console.log('📝 Transcript:', transcript || 'N/A');
      console.log('🤖 Respuesta:', replyText);
      console.log('🎵 Audio recibido:', audioBuffer.byteLength, 'bytes');
      
      if (audioBuffer.byteLength > 0) {
        console.log('🎉 El sistema de audio está funcionando correctamente!');
      }
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
  }
}

testSimple();


