export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ message: 'La pregunta es requerida' });
  }

  try {
    const response = await fetch('https://mgcapra314.app.n8n.cloud/webhook/colepa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pregunta }),
    });

    if (!response.ok) {
      throw new Error('Error al consultar al agente de IA');
    }

    const data = await response.json();
    return res.status(200).json({ respuesta: data });
  } catch (error) {
    console.error('Error en /api/consulta:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
