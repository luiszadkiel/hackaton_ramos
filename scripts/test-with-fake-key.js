// Script para probar con una API key temporal
// Uso: node scripts/test-with-fake-key.js

console.log('🧪 Probando con API key temporal...');
console.log('==================================');

// Simular una API key temporal para pruebas
const tempApiKey = 'gsk_test_key_for_demo';

async function testWithTempKey() {
  try {
    console.log('📤 Enviando mensaje de prueba...');
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-groq-key': tempApiKey  // Enviar API key en header para pruebas
      },
      body: JSON.stringify({ message: 'Hola, ¿cuáles son sus horarios?' })
    });

    console.log('📊 Estado de respuesta:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ ¡Funciona! Respuesta:', data.message);
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo: npm run dev');
  }
}

testWithTempKey();
