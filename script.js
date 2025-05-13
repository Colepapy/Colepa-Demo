const WEBHOOK_URL = 'https://mgcapra314.app.n8n.cloud/webhook/a4d322f3-78e1-434d-b81c-c78e302b1932';

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatBox = document.getElementById("chatBox");

function addMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.innerText = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = chatInput.value.trim();
  if (userInput === "") return;

  addMessage("user", userInput);
  chatInput.value = "";
  addMessage("bot", "⏳ Consultando...");

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta: userInput })
    });

    const data = await response.json();

    // Quitar "consultando..."
    const pending = chatBox.querySelector(".bot:last-child");
    if (pending) pending.remove();

    if (data.respuesta) {
      addMessage("bot", data.respuesta);
    } else {
      addMessage("bot", "⚠️ No hubo respuesta del agente.");
    }
  } catch (error) {
    const pending = chatBox.querySelector(".bot:last-child");
    if (pending) pending.remove();
    addMessage("bot", "❌ Error al conectar con el agente.");
    console.error("Error:", error);
  }
});
