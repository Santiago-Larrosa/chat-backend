import mongoose from 'mongoose';

const informeConvivenciaSchema = new mongoose.Schema({
  // 1. Datos del Alumno
  alumnoNombre: { type: String, required: true, trim: true },
  alumnoAnio: { type: String },
  alumnoDivision: { type: String },

  // 2. Acción y Sanción
  descripcionAccion: { type: String },
  solicitudSancion: { type: String },

  // 3. Docente
  docenteNombre: { type: String },
  docenteCargo: { type: String },
  docenteFecha: { type: String },
  docenteFirma: { type: String },

  // 4. Descargos e Informes
  descargoAlumno: { type: String },
  informeConsejoAula: { type: String },
  informeConsejoConvivencia: { type: String },

  // 5. Observaciones e Instancia
  observaciones: { type: String },
  instancia: { type: String }, // 'LEVE', 'GRAVE', 'MUY GRAVE'
  otraConsideracion: { type: String },

  // 6. Directivo y Notificación
  firmaDirectivo: { type: String },
  fechaDirectivo: { type: String },
  notificacionAlumno: { type: String },
  notificacionTutor: { type: String },
  notificacionFecha: { type: String },
  
}, { timestamps: true }); // 'createdAt' se añadirá automáticamente

// Índice para que la búsqueda por nombre de alumno sea rápida
informeConvivenciaSchema.index({ alumnoNombre: 'text' });

const Informe = mongoose.model('Informe', informeConvivenciaSchema);
export default Informe;
