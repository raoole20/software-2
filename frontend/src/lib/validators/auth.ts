import * as yup from "yup"

export const AuthLoginSchema = yup.object({
  email: yup.string().email("Correo inválido").required("El correo es requerido"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
})
