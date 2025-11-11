import mongoose from 'mongoose';

const informeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  contenido: {
    type: String,
    required: true,
  },
  // Opcional: para saber quién lo creó
  // autor: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // },
}, { timestamps: true });

// Índice de texto para optimizar búsquedas por nombre
informeSchema.index({ nombre: 'text' });

const Informe = mongoose.model('Informe', informeSchema);
export default Informe;
