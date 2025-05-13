async function enviarConsulta() {
  const pregunta = document.getElementById("pregunta").value.trim();
  const sessionId = "usuario_demo_123"; // Reemplazable si querés usar ID dinámico

  if (!pregunta) {
    document.getElementById("respuesta").innerText = "⚠️ Por favor, escribe una consulta.";
    return;
  }

  try {
    const res = await fetch(`https://mgcapra314.app.n8n.cloud/webhook/colepa?sessionId=${encodeURIComponent(sessionId)}&message=${encodeURIComponent(pregunta)}`, {
      method: "GET"
    });

    if (!res.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const data = await res.json();

    if (data.respuesta) {
      document.getElementById("respuesta").innerText = "🧠 Respuesta:\n" + data.respuesta;
    } else {
      document.getElementById("respuesta").innerText = "⚠️ No se recibió una respuesta válida.";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("respuesta").innerText = "❌ Error al conectar con COLEPA. Intenta nuevamente.";
  }
}
