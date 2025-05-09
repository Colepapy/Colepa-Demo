// script.js

// Referencias a elementos del DOM
const chatWindow = document.getElementById('chat-window');
const inputPregunta = document.getElementById('inputPregunta');
const btnEnviar = document.getElementById('btnEnviar');

// Función para añadir mensajes al chat
function addMessage(from, text) {
  const div = document.createElement('div');
  div.className = `message ${from}`;
  div.innerText = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Mensaje de bienvenida al cargar la página
addMessage('bot', 'Bienvenido a COLEPA. ¿En qué ley te puedo ayudar?');

// Manejo de eventos: clic en el botón y tecla Enter
btnEnviar.addEventListener('click', sendQuestion);
inputPregunta.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendQuestion();
});

// Función que envía la pregunta a tu Webhook de n8n y muestra la respuesta
async function sendQuestion() {
  const pregunta = inputPregunta.value.trim();
  if (!pregunta) return;             // No envía si el input está vacío

  // Mostrar el mensaje del usuario
  addMessage('user', pregunta);
  inputPregunta.value = '';          // Limpia el input

  try {
    // Llamada al Webhook de n8n con la nueva URL
    const res = await fetch(
      'https://mgcapra314.app.n8n.cloud/webhook-test/84b3ae9d-bcf2-44e3-a40f-ca7a2dbf9b34',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta })
      }
    );

    // Parsear la respuesta JSON
    const data = await res.json();
    // Mostrar la respuesta del bot, o mensaje por defecto si falta campo
    const respuesta = data.respuesta || 'Sin respuesta.';
    addMessage('bot', respuesta);

  } catch (err) {
    console.error(err);
    addMessage('bot', 'Error al conectar con el agente.');
  }
}
