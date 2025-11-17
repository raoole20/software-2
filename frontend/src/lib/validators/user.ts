import { Roles } from "@/types/roles";
import { string, z } from "zod";

export const createInternSchema = z.object({
  username: z.string().min(4, "Ingresa al menos 4 caracteres"),
  email: z.string().email("Ingresa un correo valido"),
  password: z.string().min(8, "La contrasena debe tener 8 caracteres"),
  rol: z.enum([Roles.ADMIN, Roles.USER], "Selecciona un rol valido"),
  first_name: z.string().min(2, "Ingresa al menos 2 caracteres"),
  last_name: z.string().min(2, "Ingresa al menos 2 caracteres"),
  sexo: z.enum(["M", "F", "O"]),
  // Ensure edad >= 15 años
  // We use a refine to validate that the date is at least 15 years ago from today
  fecha_nacimiento: z
    .date()
    .min(new Date(1900, 0, 1), "Selecciona la fecha de nacimiento")
    .refine((d) => {
      const today = new Date()
      const cutOff = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate())
      return d <= cutOff
    }, { message: 'El usuario debe tener al menos 15 años' }),
  carrera: z.string().optional(),
  universidad: z.string().optional(),
  semestre: z.string().optional(),
  meta_horas_voluntariado_interno: z.string().optional(),
  meta_horas_voluntariado_externo: z.string().optional(),
  meta_horas_chat_ingles: z.string().optional(),
  meta_horas_talleres: z.string().optional(),
}).refine((data) => {
  // If role is 'becario', require academic and hour goals fields
  if (data.rol === Roles.USER) {
    return data.carrera && data.carrera.length >= 2 &&
           data.universidad && data.universidad.length >= 2 &&
           data.semestre && data.semestre.length >= 1 &&
           data.meta_horas_voluntariado_interno &&
           data.meta_horas_voluntariado_externo &&
           data.meta_horas_chat_ingles &&
           data.meta_horas_talleres;
  }
  return true;
}, {
  message: "Los campos de formación académica y metas de horas son requeridos para becarios",
  path: ["rol"]
}).transform((data) => {
  // For admins, set default values for optional fields
  if (data.rol === Roles.ADMIN) {
    return {
      ...data,
      carrera: data.carrera || '',
      universidad: data.universidad || '',
      semestre: data.semestre || '',
      meta_horas_voluntariado_interno: data.meta_horas_voluntariado_interno || '0',
      meta_horas_voluntariado_externo: data.meta_horas_voluntariado_externo || '0',
      meta_horas_chat_ingles: data.meta_horas_chat_ingles || '0',
      meta_horas_talleres: data.meta_horas_talleres || '0',
    };
  }
  return data;
});


export type CreateInternFormValues = z.infer<typeof createInternSchema>
