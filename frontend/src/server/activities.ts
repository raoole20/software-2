"use server";

import { Activity, ActivityDTO, Hours } from "@/types/activiy";
import { request } from "./request";
import { getSession } from "@/lib";
import { AxiosError } from "axios";

export async function createActivity(data: ActivityDTO) {
  const session = await getSession();
  try {
    const response = await request.post("/api/activities/actividades/", data, {
      headers: {
        Authorization: `Token ${session?.accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error creating activity:",
        error.response?.data || error.message
      );
      throw {
        message: error.cause || "Error creating activity",
        status: error.response?.status || 500,
        controller: true,
        data: error.response?.data || { detail: error.message },
        originalError: error,
      };
    }

    throw {
      message: "Unexpected error creating activity",
      status: 500,
      controller: false,
      originalError: error,
      data: null,
    };
  }
}

export async function getAllActivities() {
  const session = await getSession();
  try {
    const response = await request.get<Activity[]>(
      "/api/activities/actividades/",
      {
        headers: {
          Authorization: `Token ${session?.accessToken}`,
        },
      }
    );

    return {
      message: "Activities fetched successfully",
      status: 200,
      controller: true,
      data: response.data,
      originalError: null,
      error: false,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching activities:",
        error.response?.data || error.message
      );
      return {
        message: error.cause || "Error fetching activities",
        status: error.response?.status || 500,
        controller: true,
        data: error.response?.data || { detail: error.message },
        originalError: error,
        error: true,
      };
    }

    return {
      message: "Unexpected error fetching activities",
      status: 500,
      controller: false,
      originalError: error,
      data: null,
      error: true,
    };
  }
}

// Obtener una actividad por ID
export async function getActivityById(id: number) {
  const session = await getSession();
  try {
    const response = await request.get<Activity>(
      `/api/activities/actividades/${id}/`,
      {
        headers: {
          Authorization: `Token ${session?.accessToken}`,
        },
      }
    );
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        message: error.cause || "Error fetching activity",
        status: error.response?.status || 500,
        controller: true,
        data: error.response?.data || { detail: error.message },
        originalError: error,
        error: true,
      };
    }

    return {
      message: "Unexpected error fetching activity",
      status: 500,
      controller: false,
      originalError: error,
      data: null,
      error: true,
    };
  }
}

export async function createRegistroHoras(data: any) {
  const session = await getSession();
  try {
    const response = await request.post("/api/records/registros-horas/", data, {
      headers: {
        Authorization: `Token ${session?.accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error creating registro horas:",
        error.response?.data || error.message
      );
      throw {
        message: error.cause || "Error creating registro horas",
        status: error.response?.status || 500,
        controller: true,
        data: error.response?.data || { detail: error.message },
        originalError: error,
      };
    }

    throw {
      message: "Unexpected error creating registro horas",
      status: 500,
      controller: false,
      originalError: error,
      data: null,
    };
  }
}

export async function getAllPendingHours() {
  const session = await getSession();
  try {
    const response = await request.get<Hours[]>(
      "/api/records/registros-horas/pendientes/",
      {
        headers: {
          Authorization: `Token ${session?.accessToken}`,
        },
      }
    );
    return {
      message: "Pending hours fetched successfully",
      status: 200,
      controller: true,
      data: response.data,
      originalError: null,
      error: false,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching pending hours:",
        error.response?.data || error.message
      );
      return {
        message: error.cause || "Error fetching pending hours",
        status: error.response?.status || 500,
        controller: true,
        data: error.response?.data || { detail: error.message },
        originalError: error,
        error: true,
      };
    }

    return {
      message: "Unexpected error fetching pending hours",
      status: 500,
      controller: false,
      originalError: error,
      data: null,
      error: true,
    };
  }
}

export async function getDetailsHorasRegistro(registroId: number) {
  try {
    const session = await getSession();
    const response = await request.get<Hours>(
      `/api/records/registros-horas/${registroId}/`,
      {
        headers: {
          Authorization: `Token ${session?.accessToken}`,
        },
      }
    );
    return {
      message: "Details fetched successfully",
      status: 200,
      controller: true,
      data: response.data,
      originalError: null,
      error: false,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching registro horas details:",
        error.response?.data || error.message
      );
      return {
        message: error.cause || "Error fetching registro horas details",
        status: error.response?.status || 500,
        controller: true,
        data: error.response?.data || { detail: error.message },
        originalError: error,
        error: true,
      };
    }

    return {
      message: "Unexpected error fetching registro horas details",
      status: 500,
      controller: false,
      originalError: error,
      data: null,
      error: true,
    };
  }
}

export async function approveHorasRegistro(registroId: number) {
  // Placeholder left intentionally earlier – replaced by aprobarRechazarHorasRegistro below.
}

// DTO que espera el endpoint /api/records/registros-horas/{id}/aprobar_rechazar/
export interface HoursApprovalDTO {
  becario: number;
  actividad: number;
  descripcion_manual: string;
  horas_reportadas: string | number;
  estado_aprobacion: "A" | "R" | "P";
  fecha_aprobacion?: string; // El backend puede generar, pero lo enviamos por consistencia
  administrador_aprobo: number;
  accion?: "aprobar" | "rechazar";
}

/**
 * Aprueba o rechaza un registro de horas.
 * Para aprobar estado_aprobacion = 'A'; para rechazar = 'R'.
 * Se arma el body completo porque el backend exige todos los campos del modelo.
 */
export async function aprobarRechazarHorasRegistro(
  registroId: number,
  data: HoursApprovalDTO
) {
  const session = await getSession();
  try {
    const response = await request.post(
      `/api/records/registros-horas/${registroId}/aprobar_rechazar/`,
      data,
      {
        headers: {
          Authorization: `Token ${session?.accessToken}`,
        },
      }
    );
    return {
      message: "Registro actualizado correctamente",
      status: 200,
      controller: true,
      data: response.data,
      error: false,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error aprobando/rechazando registro horas:",
        error.response?.data || error.message
      );
      return {
        message: error.cause || "Error aprobando/rechazando registro horas",
        status: error.response?.status || 500,
        controller: true,
        data: error.response?.data || { detail: error.message },
        error: true,
      };
    }
    return {
      message: "Unexpected error aprobando/rechazando registro horas",
      status: 500,
      controller: false,
      data: null,
      error: true,
    };
  }
}

// Obtener todos los registros de horas (no solo pendientes)
export async function getAllHorasRegistros() {
  const session = await getSession();
  try {
    const response = await request.get<Hours[]>(
      `/api/records/registros-horas/`,
      {
        headers: { Authorization: `Token ${session?.accessToken}` },
      }
    );
    return {
      message: "Registros de horas obtenidos correctamente",
      status: 200,
      controller: true,
      data: response.data,
      error: false,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error obteniendo registros de horas:",
        error.response?.data || error.message
      );
      return {
        message: error.cause || "Error obteniendo registros de horas",
        status: error.response?.status || 500,
        controller: true,
        data: error.response?.data || { detail: error.message },
        error: true,
      };
    }
    return {
      message: "Unexpected error obteniendo registros de horas",
      status: 500,
      controller: false,
      data: null,
      error: true,
    };
  }
}

// Helper para construir body con campo accion
export async function cambiarEstadoRegistroHoras(
  registro: Hours,
  nuevoEstado: "A" | "R"
) {
  const session = await getSession();
  const adminId = (session as any)?.user?.id ?? 0;
  const body: HoursApprovalDTO = {
    becario: registro.becario,
    actividad: registro.actividad,
    descripcion_manual: registro.descripcion_manual,
    horas_reportadas: registro.horas_reportadas,
    estado_aprobacion: nuevoEstado,
    fecha_aprobacion: new Date().toISOString(),
    administrador_aprobo: adminId,
    accion: nuevoEstado === "A" ? "aprobar" : "rechazar",
  };
  return aprobarRechazarHorasRegistro(registro.id, body);
}

export async function updateActivity(id: number, data: Partial<ActivityDTO>) {
  const session = await getSession();
  try {
    const response = await request.patch<Activity>(
      `/api/activities/actividades/${id}/`,
      data,
      {
        headers: {
          Authorization: `Token ${session?.accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error updating activity:",
        error.response?.data || error.message
      );
      throw {
        message: error.cause || "Error updating activity",
        status: error.response?.status || 500,
        controller: true,
        data: error.response?.data || { detail: error.message },
        originalError: error,
      };
    }

    throw {
      message: "Unexpected error updating activity",
      status: 500,
      controller: false,
      originalError: error,
      data: null,
    };
  }
}

export async function deleteActivity(id: number) {
    const session = await getSession();
    try {
        await request.delete(`/api/activities/actividades/${id}/`, {
            headers: {
                'Authorization': `Token ${session?.accessToken}`
            }
        });

        return {
            message: 'Activity deleted successfully',
            status: 200,
            error: false,
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error deleting activity:', error.response?.data || error.message);
            return {
                message: error.response?.data?.error || error.response?.data?.detail || 'Error deleting activity',
                status: error.response?.status || 500,
                error: true,
                data: error.response?.data || null,
            }
        }

        return {
            message: 'Unexpected error deleting activity',
            status: 500,
            error: true,
            data: null,
        }
    }
}