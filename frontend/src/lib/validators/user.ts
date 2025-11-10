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
  fecha_nacimiento: z.date().min(new Date(1900, 0, 1), "Selecciona la fecha de nacimiento"),
  carrera: z.string().min(2, "Ingresa el nombre de la carrera"),
  universidad: z.string().min(2, "Ingresa el nombre de la universidad"),
  semestre: z.string().min(1, "Ingresa el semestre actual"),
});


export type CreateInternFormValues = z.infer<typeof createInternSchema>
