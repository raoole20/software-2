import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getDetailsHorasRegistro } from '@/server/activities'
import { HoursApprovalControls } from '@/components/admin/hours-approval'

interface PageProps {
    params: { id: string }
}

function StatusBadge({ estado }: { estado?: string }) {
    if (!estado) return null
    const base = 'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium capitalize'
    const styles: Record<string, string> = {
        aprobado: 'bg-green-500/10 text-green-600 border-green-300',
        rechazado: 'bg-destructive/10 text-destructive border-destructive/40',
        pendiente: 'bg-primary/10 text-primary border-primary/30',
    }
    return <span className={`${base} ${styles[estado] || 'bg-muted text-muted-foreground border-border'}`}>{estado}</span>
}

export default async function Page({ params }: PageProps) {
    const hoursDetails = await getDetailsHorasRegistro(Number(params?.id))
    const data = hoursDetails?.data

    return (
        <div className="space-y-8">
            {/* Encabezado */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Registro de horas #{params.id}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {data?.becario_nombre ? (
                            <>Horas reportadas por <strong>{data.becario_nombre}</strong></>
                        ) : (
                            'Detalle del registro de horas'
                        )}
                    </p>
                </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            <StatusBadge estado={data?.estado_aprobacion} />
                            <HoursApprovalControls data={data} />
                        </div>
            </div>

            {/* Estado de error */}
            {hoursDetails?.error && (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error al cargar</CardTitle>
                        <CardDescription className="text-destructive/80">
                            {typeof hoursDetails?.data === 'object' && hoursDetails?.data?.detail
                                ? hoursDetails.data.detail
                                : hoursDetails?.message || 'No se pudo obtener la información.'}
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

            {/* Grid principal */}
            {!hoursDetails?.error && (
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Resumen del registro */}
                    <Card className="md:col-span-2">
                        <CardHeader className="border-b">
                            <CardTitle>Resumen del registro</CardTitle>
                            <CardDescription>
                                Información principal del reporte de horas
                            </CardDescription>
                            <CardAction />
                        </CardHeader>
                        <CardContent className="space-y-6 py-6">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Fecha de registro</p>
                                    <p className="font-medium">
                                        {data?.fecha_registro
                                            ? new Date(data.fecha_registro).toLocaleDateString()
                                            : '—'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Horas reportadas</p>
                                    <p className="font-medium text-primary">
                                        {data?.horas_reportadas || '—'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Estado</p>
                                    <StatusBadge estado={data?.estado_aprobacion} />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">Descripción manual</p>
                                <p className="text-sm leading-relaxed">
                                    {data?.descripcion_manual?.trim() || 'Sin descripción'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">Actividad asociada</p>
                                <div className="rounded-lg border bg-card p-4">
                                    <p className="font-medium">
                                        {data?.actividad_detalle?.titulo || '—'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {data?.actividad_detalle?.descripcion || 'Sin descripción'}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                        {data?.actividad_detalle?.tipo && (
                                            <span className="rounded-md bg-muted px-2 py-1">
                                                {data.actividad_detalle.tipo}
                                            </span>
                                        )}
                                        {data?.actividad_detalle?.modalidad && (
                                            <span className="rounded-md bg-muted px-2 py-1">
                                                {data.actividad_detalle.modalidad}
                                            </span>
                                        )}
                                        {data?.actividad_detalle?.organizacion && (
                                            <span className="rounded-md bg-muted px-2 py-1">
                                                {data.actividad_detalle.organizacion}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t justify-between text-xs text-muted-foreground">
                            <p>ID interno: {data?.id}</p>
                            <p>Actividad ID: {data?.actividad}</p>
                        </CardFooter>
                    </Card>

                    {/* Información del becario */}
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Becario</CardTitle>
                            <CardDescription>Información del participante</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 py-6">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Nombre</p>
                                <p className="font-medium">{data?.becario_nombre || '—'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">ID Becario</p>
                                <p className="font-medium">{data?.becario || '—'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Aprobó administrador</p>
                                <p className="font-medium">
                                    {data?.administrador_aprobo ? 'Sí' : 'No'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Depuración opcional */}
            <details className="text-xs opacity-70">
                <summary className="cursor-pointer">JSON crudo</summary>
                <pre className="mt-2 max-h-72 overflow-auto rounded-md bg-muted p-4 text-[10px] leading-relaxed">
                    {JSON.stringify(hoursDetails, null, 2)}
                </pre>
            </details>
        </div>
    )
}
