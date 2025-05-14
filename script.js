const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

const webhookUrl = 'https://mgcapra314.app.n8n.cloud/webhook/colepa';

userInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
  this.style.overflowY = this.scrollHeight > 150 ? 'auto' : 'hidden';
});

userInput.addEventListener('keydown', function (e) {
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
  showLoading();

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: message,
      sessionId: "cliente_web_123"
    })
  })
  .then(response => {
    if (!response.ok) throw new Error('Error en la respuesta del servidor');
    return response.json();
  })
  .then(data => {
    hideLoading();
    addMessage(data.respuesta || 'Lo siento, no pude procesar tu consulta en este momento.', 'bot');
  })
  .catch(error => {
    console.error('Error:', error);
    hideLoading();
    addMessage('Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente más tarde.', 'bot');
  });
}

function addMessage(content, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  messageDiv.innerHTML = type === 'bot' ? formatLegalTerms(content) : content;

  const timeDiv = document.createElement('div');
  timeDiv.className = 'message-time';
  timeDiv.textContent = getCurrentTime();

  messageDiv.appendChild(timeDiv);
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showLoading() {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message bot-message loading';
  loadingDiv.id = 'loading-indicator';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    loadingDiv.appendChild(dot);
  }
  messagesContainer.appendChild(loadingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  sendButton.disabled = true;
  userInput.disabled = true;
}

function hideLoading() {
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) loadingIndicator.remove();
  sendButton.disabled = false;
  userInput.disabled = false;
  userInput.focus();
}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
}

function formatLegalTerms(text) {
  const legalTerms = [
    'Código Civil', 'Código Penal', 'Constitución Nacional', 'amparo',
    'habeas corpus', 'habeas data', 'recurso de inconstitucionalidad',
    'Corte Suprema de Justicia', 'Ministerio Público', 'Poder Judicial',
    'Ley', 'Decreto', 'Resolución', 'Ordenanza', 'jurisprudencia'
  ];

  text = text.replace(/\b(Ley|Decreto|Resolución)\s+(\d+\/\d+|\d+\.\d+|\d+)/g,
    '<span class="law-citation">$1 $2</span>');

  legalTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    text = text.replace(regex, match => `<span class="legal-term">${match}</span>`);
  });

  return text;
}

window.addEventListener('load', () => {
  userInput.focus();
});
