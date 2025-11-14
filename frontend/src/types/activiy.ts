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



export type RegistroHorasDTO = {
    actividad?: number;
    descripcion_manual?: string;
    horas_reportadas: string | number;
}

export interface Hours {
    
    id:                   number;
    becario:              number;
    becario_nombre:       string;
    actividad:            number;
    actividad_detalle:    ActividadDetalle;
    descripcion_manual:   string;
    fecha_registro:       Date;
    horas_reportadas:     string;
    estado_aprobacion:    string;
    fecha_aprobacion:     null;
    administrador_aprobo: null;
}

export interface ActividadDetalle extends Activity {
    becarios_asignados:       any[];
    becarios_asignados_info:  any[];
}
