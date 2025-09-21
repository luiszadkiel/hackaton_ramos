// Script para configurar las API keys
// Uso: node scripts/setup-api-keys.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function setupApiKeys() {
  const envPath = path.join(__dirname, '../.env.local');
  
  console.log('🔧 Configuración de API Keys para Chat con Audio');
  console.log('================================================');
  
  // Leer archivo actual
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Verificar si ya existen las keys
  const hasGroq = envContent.includes('GROQ_API_KEY=') && !envContent.includes('your_groq_api_key_here');
  const hasOpenAI = envContent.includes('OPENAI_API_KEY=') && !envContent.includes('your_openai_api_key_here');
  
  console.log('📋 Estado actual:');
  console.log(`   GROQ API Key: ${hasGroq ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`   OpenAI API Key: ${hasOpenAI ? '✅ Configurada' : '❌ No configurada'}`);
  
  if (hasGroq && hasOpenAI) {
    console.log('\n🎉 ¡Todas las API keys están configuradas!');
    console.log('💡 Puedes cambiar el endpoint de /api/chat-audio-test a /api/chat-audio en el componente de chat.');
    return;
  }
  
  console.log('\n📝 Para configurar las API keys:');
  console.log('1. GROQ API Key:');
  console.log('   - Ve a https://console.groq.com');
  console.log('   - Crea una cuenta o inicia sesión');
  console.log('   - Ve a "API Keys" y crea una nueva key');
  console.log('   - Copia la key');
  
  console.log('\n2. OpenAI API Key:');
  console.log('   - Ve a https://platform.openai.com');
  console.log('   - Crea una cuenta o inicia sesión');
  console.log('   - Ve a "API Keys" y crea una nueva key');
  console.log('   - Copia la key');
  
  console.log('\n3. Edita el archivo .env.local y reemplaza:');
  console.log('   GROQ_API_KEY=your_groq_api_key_here');
  console.log('   OPENAI_API_KEY=your_openai_api_key_here');
  console.log('   Con tus keys reales');
  
  console.log('\n4. Reinicia el servidor con: npm run dev');
  
  console.log('\n🧪 Mientras tanto, puedes probar con el endpoint de prueba:');
  console.log('   - El chat funcionará con respuestas simuladas');
  console.log('   - Cambia /api/chat-audio-test por /api/chat-audio cuando tengas las keys');
}

setupApiKeys();
