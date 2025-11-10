import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: number
    username: string
    email: string
    first_name?: string
    last_name?: string
    rol?: string
    sexo?: string
    fecha_nacimiento?: string | null
    carrera?: string
    universidad?: string
    semestre?: string
    meta_horas_voluntariado_interno?: string
    meta_horas_voluntariado_externo?: string
    meta_horas_chat_ingles?: string
    meta_horas_talleres?: string
    accessToken?: string
  }

  interface Session extends DefaultSession {
    user: User
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    user?: import("next-auth").User
  }
}
