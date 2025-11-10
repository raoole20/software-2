import ActivityFormClient from '@/components/forms/ActivityFormClient'
import React from 'react'
import { Separator } from '@/components/ui/separator'

export default function Page() {
    return (
        <div className="space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-bold">Crear actividad</h1>
                <p className="text-sm text-muted-foreground">
                    Agrega una nueva actividad al catálogo. Completa los campos obligatorios y revisa la información antes de guardar.
                </p>
            </header>

            <section className="bg-card p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Detalles de la actividad</h3>
                        <p className="text-sm text-muted-foreground">Rellena los datos principales para crear la actividad.</p>
                    </div>

                    <ActivityFormClient />
                </div>
            </section>

            <Separator />
        </div>
    )
}
