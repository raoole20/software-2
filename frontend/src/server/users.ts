"use server";

import { CreateUserDTO, Users } from "@/types/user";
import { request } from "./request";
import { getSession } from "@/lib";
import { AxiosError } from "axios";

export async function createUser(data: CreateUserDTO) {
  const session = await getSession();
  try {
    // First, validate minimum age on the server-call side as a precaution
    if (data?.fecha_nacimiento) {
      let dob: Date | null = null;
      if (typeof data.fecha_nacimiento === "string") {
        dob = new Date(data.fecha_nacimiento);
      } else if (data.fecha_nacimiento instanceof Date) {
        dob = data.fecha_nacimiento;
      } else {
        dob = new Date(String(data.fecha_nacimiento));
      }

      if (!isNaN(dob.getTime())) {
        const today = new Date();
        const cutOff = new Date(
          today.getFullYear() - 15,
          today.getMonth(),
          today.getDate()
        );
        if (dob > cutOff) {
          return {
            data: null,
            status: 400,
            code: 400,
            internalCode: null,
            message: "El usuario debe tener al menos 15 años",
            error: true,
          };
        }
      }
    }

    // Ensure fecha_nacimiento is formatted as YYYY-MM-DD (DRF DateField expects this)
    const payload: any = { ...data };
    if (payload.fecha_nacimiento) {
      // if it's already a string in YYYY-MM-DD, keep it
      if (typeof payload.fecha_nacimiento === "string") {
        // leave as-is
      } else if (payload.fecha_nacimiento instanceof Date) {
        const d: Date = payload.fecha_nacimiento;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        payload.fecha_nacimiento = `${yyyy}-${mm}-${dd}`;
      } else {
        // fallback: try to stringify and take first 10 chars if ISO-like
        const s = String(payload.fecha_nacimiento);
        if (s.includes("T")) payload.fecha_nacimiento = s.slice(0, 10);
      }
    }

    const response = await request.post("/api/users/usuarios/", payload, {
      headers: {
        Authorization: `Token ${session?.accessToken}`,
      },
    });

    return {
      data: response.data,
      status: response.status,
      code: response.statusText,
      internalCode: null,
      error: false,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    if (error instanceof AxiosError) {
      return {
        data: error.response?.data,
        status: error.response?.status,
        code: error.response?.status,
        internalCode: error.code,
        message:
          error.response?.data?.message ||
          "An error occurred while fetching users",
        error: true,
      };
    }
  }

  return {
    data: null,
    status: 500,
    internalCode: "U_#501",
    code: "internal_server_error",
    message: "An unexpected error occurred while fetching users",
    error: true,
  };
}

export async function getAllUsers() {
  const session = await getSession();
  try {
    const response = await request.get<Users[]>("/api/users/usuarios/", {
      headers: {
        Authorization: `Token ${session?.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    if (error instanceof AxiosError) {
      throw {
        data: error.response?.data,
        status: error.response?.status,
        code: error.response?.status,
        internalCode: error.code,
        message:
          error.response?.data?.message ||
          "An error occurred while fetching users",
      };
    }
  }

  throw {
    data: null,
    status: 500,
    internalCode: "U_#501",
    code: "internal_server_error",
    message: "An unexpected error occurred while fetching users",
  };
}

export async function getMyProfile() {
  const session = await getSession();
  try {
    const response = await request.get<Users>("/api/users/usuarios/mi_perfil/", {
      headers: {
        Authorization: `Token ${session?.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my profile:", error);
    if (error instanceof AxiosError) {
      throw {
        data: error.response?.data,
        status: error.response?.status,
        code: error.response?.status,
        internalCode: error.code,
        message:
          error.response?.data?.message ||
          "An error occurred while fetching profile",
      };
    }
  }

  throw {
    data: null,
    status: 500,
    internalCode: "U_#501",
    code: "internal_server_error",
    message: "An unexpected error occurred while fetching profile",
  };
}

export async function getUserById(id: number) {
  const session = await getSession();
  try {
    const response = await request.get<Users>(`/api/users/usuarios/${id}/`, {
      headers: {
        Authorization: `Token ${session?.accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    if (error instanceof AxiosError) {
      throw {
        data: error.response?.data,
        status: error.response?.status,
        code: error.response?.status,
        internalCode: error.code,
        message:
          error.response?.data?.message ||
          "An error occurred while fetching user",
      };
    }
  }

  throw {
    data: null,
    status: 500,
    internalCode: "U_#501",
    code: "internal_server_error",
    message: "An unexpected error occurred while fetching user",
  };
}

export async function deleteUser(id: number) {
  const session = await getSession();
  try {
    await request.delete(`/api/users/usuarios/${id}/`, {
      headers: {
        Authorization: `Token ${session?.accessToken}`,
      },
    })
    return {
      message: 'User deleted successfully',
      status: 200,
      error: false,
      data: null,
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data?.message || 'An error occurred while deleting the user',
        status: error.response?.status || 500,
        error: true,
        data: error.response?.data || null,
      }
    }
  }

  return {
    message: 'An unexpected error occurred while deleting the user',
    status: 500,
    error: true,
    data: null,
  }
}


export async function editUser(data: Partial<Users> & { id: number }) {
  const session = await getSession();
  try {
    const response = await request.patch<Users>(`/api/users/usuarios/${data.id}/`, data, {
      headers: {
        Authorization: `Token ${session?.accessToken}`,
      },
    });
    return {
      data: response.data,
      status: response.status,
      code: response.statusText,
      internalCode: null,
      error: false,
    };
  } catch (error) {
    console.error('Error editing user:', error);
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data?.message || 'An error occurred while editing the user',
        status: error.response?.status || 500,
        error: true,
        data: error.response?.data || null,
      }
    }

    return {
      message: 'An unexpected error occurred while editing the user',
      status: 500,
      error: true,
      data: null,
    }
  }
}