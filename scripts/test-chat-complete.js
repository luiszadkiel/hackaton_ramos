// Script de prueba completa para el chat
// Uso: node scripts/test-chat-complete.js

const fs = require('fs');
const path = require('path');

async function testChatComplete() {
  console.log('🧪 Prueba completa del sistema de chat');
  console.log('=====================================');
  
  // Verificar configuración
  console.log('\n1️⃣ Verificando configuración...');
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('✅ Archivo .env.local encontrado');
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('GROQ_API_KEY=')) {
      console.log('✅ GROQ_API_KEY configurada');
    } else {
      console.log('❌ GROQ_API_KEY no encontrada en .env.local');
      return;
    }
  } else {
    console.log('❌ Archivo .env.local no encontrado');
    console.log('📝 Crea el archivo .env.local con tu API key de Groq');
    return;
  }

  // Probar endpoint de texto
  console.log('\n2️⃣ Probando endpoint de texto...');
  try {
    const textResponse = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hola, ¿cuáles son sus horarios?' })
    });

    if (textResponse.ok) {
      const textData = await textResponse.json();
      console.log('✅ Endpoint de texto funciona');
      console.log('📝 Respuesta:', textData.message?.substring(0, 100) + '...');
    } else {
      console.log('❌ Error en endpoint de texto:', textResponse.status);
      const errorText = await textResponse.text();
      console.log('📝 Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Error de conexión en endpoint de texto:', error.message);
  }

  // Probar endpoint de audio
  console.log('\n3️⃣ Probando endpoint de audio...');
  try {
    // Crear un archivo de audio simulado
    const audioData = new Uint8Array(1000);
    const audioBlob = new Blob([audioData], { type: 'audio/webm' });
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'test-audio.webm');
    
    const audioResponse = await fetch('http://localhost:3000/api/chat-audio-debug', {
      method: 'POST',
      body: formData,
    });

    if (audioResponse.ok) {
      const audioData = await audioResponse.json();
      console.log('✅ Endpoint de audio funciona');
      console.log('📝 Transcripción:', audioData.transcript || 'N/A');
      console.log('📝 Respuesta:', audioData.reply?.substring(0, 100) + '...');
    } else {
      console.log('❌ Error en endpoint de audio:', audioResponse.status);
      const errorText = await audioResponse.text();
      console.log('📝 Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Error de conexión en endpoint de audio:', error.message);
  }

  console.log('\n🎉 Prueba completada!');
  console.log('\n📋 Para usar el chat:');
  console.log('   1. Ejecuta: npm run dev');
  console.log('   2. Ve a: http://localhost:3000/cliente/chat');
  console.log('   3. Prueba enviar mensajes de texto');
  console.log('   4. Prueba grabar audio con el micrófono');
}

testChatComplete().catch(console.error);
