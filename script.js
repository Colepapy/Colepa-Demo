const webhookURL = "https://mgcapra314.app.n8n.cloud/webhook/4ceb34c9-02a4-4f69-8eaf-b74f7cb8485c";

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-box");

// Agrega un mensaje al chat
function addMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.innerText = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Maneja el envío del formulario
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = chatInput.value.trim();
  if (userInput === "") return;

  addMessage("user", userInput);
  chatInput.value = "";
  addMessage("bot", "⏳ Pensando...");

  try {
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pregunta: userInput }),
    });

    const data = await response.json();

    // Elimina el mensaje de "Pensando..."
    const thinkingMsg = chatBox.querySelector(".bot:last-child");
    if (thinkingMsg) thinkingMsg.remove();

    if (data.respuesta) {
      addMessage("bot", data.respuesta);
    } else {
      addMessage("bot", "⚠️ No se pudo obtener una respuesta.");
    }
  } catch (error) {
    const thinkingMsg = chatBox.querySelector(".bot:last-child");
    if (thinkingMsg) thinkingMsg.remove();
    addMessage("bot", "❌ Error al conectar con el servidor.");
    console.error("Error:", error);
  }
});
  
