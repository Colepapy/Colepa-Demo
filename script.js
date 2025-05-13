const WEBHOOK_URL = 'https://mgcapra314.app.n8n.cloud/webhook/a4d322f3-78e1-434d-b81c-c78e302b1932';

// Generar un ID único de sesión para mantener contexto
let sessionId = localStorage.getItem('colepa_session_id');
if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('colepa_session_id', sessionId);
}

const chatContainer = document.getElementById("chat");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

function appendMessage(sender, text) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerText = text;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendButton.addEventListener("click", async () => {
    const pregunta = userInput.value.trim();
    if (!pregunta) return;

    appendMessage("user", pregunta);
    userInput.value = "";

    appendMessage("bot", "Pensando...");

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pregunta: pregunta,
                sessionId: sessionId
            })
        });

        const data = await response.json();

        const botResponses = document.querySelectorAll(".message.bot");
        if (botResponses.length > 0) {
            botResponses[botResponses.length - 1].remove(); // eliminar "Pensando..."
        }

        appendMessage("bot", data.respuesta || "No entendí tu pregunta.");
    } catch (error) {
        console.error("Error:", error);
        appendMessage("bot", "Ocurrió un error al procesar tu pregunta.");
    }
});
