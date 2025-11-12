import express from 'express';
import Informe from '../models/Informe.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Middleware de autenticación (asumiendo que lo tienes o lo añades)
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado, no hay token' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido' });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en autenticación' });
  }
};

// POST: Crear un nuevo informe de convivencia
router.post('/', authenticate, async (req, res) => {
  try {
    // El 'req.body' ahora contendrá todos los campos del formulario
    // Asignamos el autor basado en el token
    const informeData = {
      ...req.body,
      // Opcional: registrar quién guardó el informe
      // autorId: req.user.id,
      // autorNombre: req.user.username,
    };
    const nuevoInforme = new Informe(informeData);
    await nuevoInforme.save();
    res.status(201).json(nuevoInforme);
  } catch (err) {
    console.error("Error al crear informe:", err);
    res.status(500).json({ error: 'Error al crear informe' });
  }
});

// GET: Buscar informes POR NOMBRE DE ALUMNO
router.get('/', authenticate, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // --- ¡CAMBIO CLAVE! ---
      // Buscamos usando 'alumnoNombre' en lugar de 'nombre'
      query.alumnoNombre = { $regex: search, $options: 'i' };
    }

    // Devolvemos los más recientes que coincidan
    const informes = await Informe.find(query).sort({ createdAt: -1 });
    res.json(informes);
  } catch (err) {
    console.error("Error al buscar informes:", err);
    res.status(500).json({ error: 'Error al buscar informes' });
  }
});

export default router;
