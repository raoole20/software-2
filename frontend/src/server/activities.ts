'use server';

import { Activity, ActivityDTO, Hours } from "@/types/activiy";
import { request } from "./request";
import { getSession } from "@/lib";
import { AxiosError } from "axios";

export async function createActivity(data: ActivityDTO) {
    const session = await getSession();
    try {
        const response = await request.post('/api/activities/actividades/', data, {
            headers: {
                'Authorization': `Token ${session?.accessToken}`
            }
        });
    
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error creating activity:', error.response?.data || error.message);
            throw {
                message: error.cause || 'Error creating activity',
                status: error.response?.status || 500,
                controller: true,
                data: error.response?.data || { detail: error.message },
                originalError: error
            }
        }

        throw {
            message: 'Unexpected error creating activity',
            status: 500,
            controller: false,
            originalError: error,
            data: null
        }
    }
}

export async function getAllActivities() {
    const session = await getSession();
    try {
        const response = await request.get<Activity[]>('/api/activities/actividades/', {
            headers: {
                'Authorization': `Token ${session?.accessToken}`
            }
        });
    
        return {
            message: 'Activities fetched successfully',
            status: 200,
            controller: true,
            data: response.data,
            originalError: null,
            error: false,
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error fetching activities:', error.response?.data || error.message);
            return {
                message: error.cause || 'Error fetching activities',
                status: error.response?.status || 500,
                controller: true,
                data: error.response?.data || { detail: error.message },
                originalError: error,
                error: true,
            }
        }

        return {
            message: 'Unexpected error fetching activities',
            status: 500,
            controller: false,
            originalError: error,
            data: null,
            error: true,
        }
    }
}

export type RegistroHorasDTO = {
    actividad?: number;
    descripcion_manual?: string;
    horas_reportadas: string | number;
}

export async function createRegistroHoras(data: RegistroHorasDTO) {
    const session = await getSession();
    try {
        const response = await request.post('/api/records/registros-horas/', data, {
            headers: {
                'Authorization': `Token ${session?.accessToken}`
            }
        });

        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error creating registro horas:', error.response?.data || error.message);
            throw {
                message: error.cause || 'Error creating registro horas',
                status: error.response?.status || 500,
                controller: true,
                data: error.response?.data || { detail: error.message },
                originalError: error
            }
        }

        throw {
            message: 'Unexpected error creating registro horas',
            status: 500,
            controller: false,
            originalError: error,
            data: null
        }
    }
}

export async function getAllPendingHours() {
    const session = await getSession();
    try {
        const response = await request.get<Hours[]>('/api/records/registros-horas/pendientes/', {
            headers: {  
                'Authorization': `Token ${session?.accessToken}`
            }
        });
        return {
            message: 'Pending hours fetched successfully',
            status: 200,
            controller: true,
            data: response.data,
            originalError: null,
            error: false,
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error fetching pending hours:', error.response?.data || error.message);
            return {
                message: error.cause || 'Error fetching pending hours',
                status: error.response?.status || 500,
                controller: true,
                data: error.response?.data || { detail: error.message },
                originalError: error,
                error: true
            }
        }

        return {
            message: 'Unexpected error fetching pending hours',
            status: 500,
            controller: false,
            originalError: error,
            data: null,
            error: true
        }
    }
}
