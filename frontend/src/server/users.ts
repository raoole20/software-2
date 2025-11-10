"use server";

import { CreateUserDTO, Users } from "@/types/user";
import { request } from "./request";
import { getSession } from "@/lib";
import { AxiosError } from "axios";

export async function createUser(data: CreateUserDTO) {
  const session = await getSession();
  try {
    // Ensure fecha_nacimiento is formatted as YYYY-MM-DD (DRF DateField expects this)
    const payload: any = { ...data }
    if (payload.fecha_nacimiento) {
      // if it's already a string in YYYY-MM-DD, keep it
      if (typeof payload.fecha_nacimiento === 'string') {
        // leave as-is
      } else if (payload.fecha_nacimiento instanceof Date) {
        const d: Date = payload.fecha_nacimiento
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        payload.fecha_nacimiento = `${yyyy}-${mm}-${dd}`
      } else {
        // fallback: try to stringify and take first 10 chars if ISO-like
        const s = String(payload.fecha_nacimiento)
        if (s.includes('T')) payload.fecha_nacimiento = s.slice(0, 10)
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
    };
  } catch (error) {
    console.error(error);
    if(error instanceof AxiosError) {
        throw {
            data: error.response?.data,
            status: error.response?.status,
            code: error.response?.status,
            internalCode: error.code,
            message: error.response?.data?.message || "An error occurred while creating the user",
        };
    }

    throw {
        data: null,
        status: 500,
        internalCode: "U_#500",
        code: "internal_server_error",
        message: "An unexpected error occurred",
    };
  }
}

export async function getAllUsers() {
  const session = await getSession();
  try {
    const response = await request.get<Users[]>("/api/users/usuarios/", {
      headers: {
        Authorization: `Token ${session?.accessToken}`,
      }
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
        message: error.response?.data?.message || "An error occurred while fetching users",
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