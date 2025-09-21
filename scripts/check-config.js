// Script para verificar la configuración
// Uso: node scripts/check-config.js

console.log('🔍 Verificando configuración del proyecto');
console.log('=====================================');

// Verificar variables de entorno
const requiredEnvVars = ['GROQ_API_KEY'];
const missingVars = [];

console.log('\n📋 Variables de entorno requeridas:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('\n⚠️  Variables faltantes:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Para configurar, crea un archivo .env.local con:');
  missingVars.forEach(varName => {
    console.log(`   ${varName}=tu_valor_aqui`);
  });
} else {
  console.log('\n✅ Todas las variables de entorno están configuradas');
}

console.log('\n🚀 Para probar el chat:');
console.log('   1. Ejecuta: npm run dev');
console.log('   2. Ve a: http://localhost:3000/cliente/chat');
console.log('   3. Prueba enviar un mensaje de texto');
console.log('   4. Prueba grabar un audio');
