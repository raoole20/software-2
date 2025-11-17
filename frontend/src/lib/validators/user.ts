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
  carrera: z.string().min(2, "Ingresa el nombre de la carrera"),
  universidad: z.string().min(2, "Ingresa el nombre de la universidad"),
  semestre: z.string().min(1, "Ingresa el semestre actual"),
});


export type CreateInternFormValues = z.infer<typeof createInternSchema>
