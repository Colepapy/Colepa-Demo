export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Pregunta recibida:', req.body);
    res.status(200).json({ message: 'Recibido', data: req.body });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
