'use server';

import { Activity, ActivityDTO, Hours, RegistroHorasDTO } from "@/types/activiy";
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
    
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error fetching activities:', error.response?.data || error.message);
            throw {
                message: error.cause || 'Error fetching activities',
                status: error.response?.status || 500,
                controller: true,
                data: error.response?.data || { detail: error.message },
                originalError: error
            }
        }

        throw {
            message: 'Unexpected error fetching activities',
            status: 500,
            controller: false,
            originalError: error,
            data: null
        }
    }
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


export async function getAllHours() {
    const session = await getSession();
    try {
        const response = await request.get<Hours[]>(`/api/records/registros-horas`)

        return {
            data: response.data,
            status: response.status,
            error: false,
            message: 'Fetched successfully'
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error fetching hours:', error.response?.data || error.message);
            return {
                data: null,
                status: error.response?.status || 500,
                error: true,
                message: error.cause || 'Error fetching hours'
            }
        }

        return {
            data: null,
            status: 500,
            error: true,
            message: 'Unexpected error fetching hours'
        }
    }
}

