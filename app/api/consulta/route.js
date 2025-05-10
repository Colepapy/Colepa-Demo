export async function POST(request) {
  const body = await request.json();
  const { pregunta } = body;

  if (!pregunta) {
    return new Response(JSON.stringify({ message: 'La pregunta es requerida' }), {
      status: 400,
    });
  }

  try {
    const res = await fetch('https://mgcapra314.app.n8n.cloud/webhook/colepa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta }),
    });

    if (!res.ok) {
      throw new Error('Error al consultar al agente de IA');
    }

    const data = await res.json();

    return new Response(JSON.stringify({ respuesta: data }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error en /api/consulta:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), {
      status: 500,
    });
  }
}
