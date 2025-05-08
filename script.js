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

// Mensaje de bienvenida
addMessage('bot', 'Bienvenido a COLEPA. ¿En qué ley te puedo ayudar?');

// Eventos
btnEnviar.addEventListener('click', sendQuestion);
inputPregunta.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendQuestion();
});

async function sendQuestion() {
  const pregunta = inputPregunta.value.trim();
  if (!pregunta) return;
  addMessage('user', pregunta);
  inputPregunta.value = '';

  try {
    const res = await fetch(
      'https://mgcapra314.app.n8n.cloud/prueba-de-webhook/ddbbf13a-4f89-490a-811f-c5f0b93a0311',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta })
      }
    );
    const data = await res.json();
    const respuesta = data.respuesta || 'Sin respuesta.';
    addMessage('bot', respuesta);
  } catch (err) {
    console.error(err);
    addMessage('bot', 'Error al conectar con el agente.');
  }
}

