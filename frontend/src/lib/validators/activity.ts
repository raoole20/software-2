import * as yup from 'yup'

export const ActivitySchema = yup.object({
  titulo: yup.string().required('El título es requerido').min(3, 'Mínimo 3 caracteres'),
  descripcion: yup.string().nullable(),
  tipo: yup.string().oneOf(['Interna','Externa','Taller','Chat'], 'Selecciona un tipo válido').required('Tipo es requerido'),
  fecha: yup.string().required('Fecha es requerida'),
  duracion_horas: yup.number().typeError('Duración inválida').required('Duración es requerida').min(0.25, 'Duración mínima 0.25 horas'),
  competencia_desarrollada: yup.string().nullable(),
  modalidad: yup.string().oneOf(['P','V'], 'Selecciona modalidad').required('Modalidad es requerida'),
  organizacion: yup.string().nullable(),
  facilitador: yup.string().nullable(),
  en_catalogo: yup.boolean().required(),
})

export type ActivityFormValues = yup.InferType<typeof ActivitySchema>
