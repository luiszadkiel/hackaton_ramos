// Script de prueba para el chat
// Uso: node scripts/test-chat.js

async function testChat() {
  console.log('🧪 Probando Chat con Respuestas Dinámicas');
  console.log('==========================================');
  
  const testMessages = [
    'Hola',
    '¿Cuáles son los precios?',
    '¿Qué servicios ofrecen?',
    '¿Cuánto tiempo toma la entrega?',
    '¿Cuáles son los horarios?',
    'Gracias'
  ];

  for (const message of testMessages) {
    try {
      console.log(`\n👤 Usuario: ${message}`);
      
      const response = await fetch('http://localhost:3000/api/chat-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`🤖 Bot: ${data.message}`);
      } else {
        console.log(`❌ Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error de conexión: ${error.message}`);
    }
  }
  
  console.log('\n✅ Prueba completada!');
  console.log('\n💡 Ahora puedes:');
  console.log('1. Escribir mensajes de texto en el chat');
  console.log('2. Grabar audios y enviarlos');
  console.log('3. Recibir respuestas dinámicas del bot');
  console.log('4. Escuchar las respuestas con TTS del navegador');
}

testChat();




