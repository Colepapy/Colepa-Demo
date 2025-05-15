const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const webhookUrl = 'https://mgcapra314.app.n8n.cloud/webhook/a4d322f3-78e1-434d-b81c-c78e302b1932';

// Auto ajuste de altura del textarea
userInput.addEventListener('input', () => {
  userInput.style.height = 'auto';
  userInput.style.height = userInput.scrollHeight + 'px';
});

// Enviar con Enter
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendButton.addEventListener('click', sendMessage);

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';
  userInput.style.height = 'auto';

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => {
      addMessage(data.response || data.message || 'Respuesta no disponible.', 'bot');
    })
    .catch(() => {
      addMessage('Error al conectar con el servidor.', 'bot');
    });
}

function addMessage(content, type) {
  const div = document.createElement('div');
  div.className = `message ${type}-message`;

  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = content;
  div.appendChild(contentDiv);

  const timeDiv = document.createElement('div');
  timeDiv.className = 'message-time';
  timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  div.appendChild(timeDiv);

  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
