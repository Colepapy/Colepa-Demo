const webhookUrl = 'https://mgcapra314.app.n8n.cloud/webhook/colepa';

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `message ${type}-message`;
  msg.textContent = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';
  showLoading();

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: text,
      sessionId: 'cliente_web_001'
    })
  })
    .then(res => res.json())
    .then(data => {
      hideLoading();
      addMessage(data.respuesta || '❗ Sin respuesta del agente.', 'bot');
    })
    .catch(err => {
      console.error(err);
      hideLoading();
      addMessage('❌ Error al conectar con el servidor.', 'bot');
    });
}

function showLoading() {
  const loading = document.createElement('div');
  loading.className = 'message bot-message';
  loading.id = 'loading';
  loading.textContent = 'Escribiendo...';
  messagesDiv.appendChild(loading);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.remove();
}
