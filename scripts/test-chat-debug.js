// Script de debug para el chat
// Uso: node scripts/test-chat-debug.js

async function testChatDebug() {
  console.log('🔍 Debug del chat...');
  console.log('===================');
  
  // Probar endpoint de texto
  console.log('\n1️⃣ Probando endpoint de texto...');
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hola, ¿cuáles son sus horarios?' })
    });

    console.log('📊 Estado:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📝 Respuesta:', data);
      
      if (data.message === "No disponible") {
        console.log('❌ El chat está devolviendo "No disponible"');
        console.log('💡 Esto indica un problema con la API key de Groq');
      } else {
        console.log('✅ El chat funciona correctamente');
      }
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }

  // Probar endpoint de audio
  console.log('\n2️⃣ Probando endpoint de audio...');
  try {
    const audioData = new Uint8Array(1000);
    const audioBlob = new Blob([audioData], { type: 'audio/webm' });
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'test-audio.webm');
    
    const response = await fetch('http://localhost:3000/api/chat-audio-debug', {
      method: 'POST',
      body: formData,
    });

    console.log('📊 Estado:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📝 Respuesta:', data);
      
      if (data.reply === "No disponible") {
        console.log('❌ El audio está devolviendo "No disponible"');
        console.log('💡 Esto indica un problema con la API key de Groq');
      } else {
        console.log('✅ El audio funciona correctamente');
      }
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }

  console.log('\n📋 SOLUCIÓN:');
  console.log('1. Ve a: https://console.groq.com');
  console.log('2. Crea una cuenta o inicia sesión');
  console.log('3. Ve a "API Keys" y crea una nueva key');
  console.log('4. Copia la key (algo como: gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)');
  console.log('5. Edita el archivo .env.local y reemplaza REEMPLAZA_CON_TU_API_KEY_DE_GROQ con tu key real');
  console.log('6. Reinicia el servidor: npm run dev');
}

testChatDebug().catch(console.error);


