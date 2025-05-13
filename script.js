<script>
  async function enviarConsultaALaIA(pregunta, sessionId) {
    try {
      const response = await fetch("https://tu-n8n.vercel.app/webhook/colepa?sessionId=" + sessionId + "&message=" + encodeURIComponent(pregunta), {
        method: "GET"
      });

      const data = await response.json();

      if (data.respuesta) {
        console.log("Respuesta de la IA:", data.respuesta);
        // Aquí podés mostrar la respuesta en la página
        document.getElementById("respuesta").innerText = data.respuesta;
      } else {
        throw new Error("Respuesta inválida");
      }
    } catch (error) {
      console.error("Error al consultar la IA:", error);
      document.getElementById("respuesta").innerText = "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente más tarde.";
    }
  }

  // 👇 Esto lo podés reemplazar con lo que el usuario escriba en un formulario
  enviarConsultaALaIA("¿Qué dice el artículo 1 del Código Civil?", "cliente_123");
</script>

<div id="respuesta"></div>
