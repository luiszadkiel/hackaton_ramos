// Script para probar con API key temporal
// Uso: node scripts/test-with-temp-key.js

async function testWithTempKey() {
  console.log('🧪 Probando con API key temporal...');
  console.log('==================================');
  
  // Probar endpoint de texto con API key en header
  console.log('\n1️⃣ Probando endpoint de texto con API key temporal...');
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-groq-key': 'gsk_test_key_for_demo'  // API key temporal en header
      },
      body: JSON.stringify({ message: 'Hola, ¿cuáles son sus horarios?' })
    });

    console.log('📊 Estado:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📝 Respuesta:', data);
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }

  // Probar endpoint de texto con API key en body
  console.log('\n2️⃣ Probando endpoint de texto con API key en body...');
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Hola, ¿cuáles son sus horarios?',
        apiKey: 'gsk_test_key_for_demo'  // API key temporal en body
      })
    });

    console.log('📊 Estado:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📝 Respuesta:', data);
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }

  console.log('\n📋 DIAGNÓSTICO:');
  console.log('Si ambos fallan, el problema es que necesitas una API key real de Groq');
  console.log('Si uno funciona, podemos configurar el frontend para usar ese método');
}

testWithTempKey().catch(console.error);


