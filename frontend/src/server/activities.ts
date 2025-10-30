'use server';

import { ActivityDTO } from "@/types/activiy";
import { request } from "./request";
import { getSession } from "@/lib";
import { AxiosError } from "axios";

export async function createActivity(data: ActivityDTO) {
    const session = await getSession();
    try {
        const response = await request.post('/api/activities/actividades/', data, {
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`
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



