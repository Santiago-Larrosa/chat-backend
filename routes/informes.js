import express from 'express';
import Informe from '../models/Informe.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Middleware de autenticación (copiado de tus otras rutas)
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
};

// POST: Crear un nuevo informe
router.post('/', authenticate, async (req, res) => {
  try {
    const { nombre, contenido } = req.body;
    if (!nombre || !contenido) {
      return res.status(400).json({ error: 'Nombre y contenido son obligatorios' });
    }
    const nuevoInforme = new Informe({ nombre, contenido });
    await nuevoInforme.save();
    res.status(201).json(nuevoInforme);
  } catch (err) {
    console.error("Error al crear informe:", err);
    res.status(500).json({ error: 'Error al crear informe' });
  }
});

// GET: Buscar informes por nombre
router.get('/', authenticate, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Usamos regex para buscar nombres que "contengan" el término de búsqueda
      query.nombre = { $regex: search, $options: 'i' };
    }

    // Devolvemos los 10 más recientes que coincidan
    const informes = await Informe.find(query).sort({ createdAt: -1 }).limit(10);
    res.json(informes);
  } catch (err) {
    console.error("Error al buscar informes:", err);
    res.status(500).json({ error: 'Error al buscar informes' });
  }
});

export default router;
