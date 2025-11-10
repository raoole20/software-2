export interface Activity {
    id:                       number;
    titulo:                   string;
    descripcion:              string;
    tipo:                     string;
    fecha:                    Date;
    duracion_horas:           string;
    competencia_desarrollada: string;
    modalidad:                string;
    organizacion:             string;
    facilitador:              string;
    creador:                  number;
    creador_nombre:           string;
    en_catalogo:              boolean;
    fecha_creacion:           Date;
}

export type ActivityDTO = Omit<Activity, 'id' | 'creador' | 'creador_nombre' | 'en_catalogo' | 'fecha_creacion'> & {
    fecha: Date | string;
    duracion_horas: string | number;
}
