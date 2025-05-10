document.addEventListener('DOMContentLoaded', () => {
  const WEBHOOK_URL = 'https://mgcapra314.app.n8n.cloud/webhook/84b3ae9d-bcf2-44e3-a40f-ca7a2dbf9b34';

  const chatContainer = document.getElementById('chatContainer');
  const chatMessages = document.getElementById('chatMessages');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const messageForm = document.getElementById('messageForm');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');

  function addMessage(text, sender) {
    if (welcomeMessage) welcomeMessage.remove();
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = `avatar ${sender}-avatar`;
    avatar.innerHTML = sender === 'user'
      ? '<i class="fas fa-user"></i>'
      : '<i class="fas fa-balance-scale"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = text
      .split('\n')
      .map(l => `<p>${l}</p>`)
      .join('');

    const time = document.createElement('div');
    time.className = 'message-time';
    const now = new Date();
    time.textContent = `${now.getHours()}:${now.getMinutes().toString().padStart(2,'0')}`;
    content.appendChild(time);

    if (sender === 'user') {
      msgDiv.append(content, avatar);
    } else {
      msgDiv.append(avatar, content);
    }

    chatMessages.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.id = 'typing';
    typing.className = 'message ai-message typing-message';
    const avatar = document.createElement('div');
    avatar.className = 'avatar ai-avatar';
    avatar.innerHTML = '<i class="fas fa-balance-scale"></i>';
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.textContent = 'Consultando leyes paraguayas';
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    [0,1,2].forEach(() => {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      dots.appendChild(dot);
    });
    indicator.appendChild(dots);
    typing.append(avatar, indicator);
    chatMessages.appendChild(typing);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typing');
    if (t) t.remove();
  }

  async function enviarPreguntaAlServidor(pregunta) {
    const respuesta = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta })
    });
    const datos = await respuesta.json();
    return datos.respuesta;
  }

  function processUserMessage(message) {
    userInput.disabled = true;
    sendBtn.disabled = true;
    addMessage(message, 'user');
    showTyping();

    enviarPreguntaAlServidor(message)
      .then(texto => {
        removeTyping();
        addMessage(texto || 'Sin respuesta del agente.', 'ai');
      })
      .catch(err => {
        console.error(err);
        removeTyping();
        addMessage('⚠️ Error al conectar con el agente.', 'ai');
      })
      .finally(() => {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
      });
  }

  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const msg = userInput.value.trim();
    if (msg) {
      userInput.value = '';
      processUserMessage(msg);
    }
  });

  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = `${userInput.scrollHeight}px`;
  });

  userInput.focus();
});
