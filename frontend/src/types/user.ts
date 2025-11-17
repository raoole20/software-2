import { Roles } from "./roles";

export interface CreateUserDTO {
    username:         string;
    email:            string;
    password:         string;
    first_name:       string;
    last_name:        string;
    rol:              Roles;
    sexo:             'M' | 'F' | 'O';
    fecha_nacimiento: Date;
    carrera?:         string;
    universidad?:     string;
    semestre?:        string;
    meta_horas_voluntariado_interno?: string;
    meta_horas_voluntariado_externo?: string;
    meta_horas_chat_ingles?:          string;
    meta_horas_talleres?:             string;
}

export interface Users {
    id:                              number;
    username:                        string;
    email:                           string;
    first_name:                      string;
    last_name:                       string;
    rol:                             string;
    sexo:                            string;
    fecha_nacimiento:                string;
    carrera:                         string;
    universidad:                     string;
    semestre:                        string;
    meta_horas_voluntariado_interno: string;
    meta_horas_voluntariado_externo: string;
    meta_horas_chat_ingles:          string;
    meta_horas_talleres:             string;
    pregunta_seguridad?:             string;
    configuracion_inicial_completada: boolean;
    actividades_asignadas?:          string;
}
