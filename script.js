<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>COLEPA - Consulta Legal</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 2rem;
      background-color: #f7f7f7;
    }
    #respuesta {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #e8f0fe;
      border-radius: 6px;
      white-space: pre-wrap;
    }
    input, button {
      padding: 0.5rem;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <h1>Consultar a COLEPA</h1>
  <input type="text" id="pregunta" placeholder="Escribe tu consulta legal..." size="50" />
  <button onclick="enviarConsulta()">Consultar</button>

  <div id="respuesta"></div>

  <script>
    async function enviarConsulta() {
      const pregunta = document.getElementById("pregunta").value.trim();
      const sessionId = "usuario_demo_123"; // Podés cambiar por un ID dinámico si querés

      if (!pregunta) {
        document.getElementById("respuesta").innerText = "Por favor, escribe una consulta.";
        return;
      }

      try {
        const res = await fetch(`https://mgcapra314.app.n8n.cloud/webhook/colepa?sessionId=${encodeURIComponent(sessionId)}&message=${encodeURIComponent(pregunta)}`, {
          method: "GET"
        });

        const data = await res.json();

        if (data.respuesta) {
          document.getElementById("respuesta").innerText = data.respuesta;
        } else {
          document.getElementById("respuesta").innerText = "⚠️ No se recibió una respuesta válida del agente.";
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("respuesta").innerText = "❌ Error al conectar con COLEPA. Intenta nuevamente.";
      }
    }
  </script>
</body>
</html>
