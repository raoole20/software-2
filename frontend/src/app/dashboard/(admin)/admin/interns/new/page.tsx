import React from 'react'

import CreateUserForm from '@/components/form/users/create-inter-form'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, ClipboardList, Lightbulb, UsersRound } from 'lucide-react'

const primaryActions = [
    {
        title: 'Solicita documentacion oficial',
        description: 'Identificacion, CV y comprobante de inscripcion vigentes.',
    },
    {
        title: 'Activa credenciales de acceso',
        description: 'Coordina con TI la creacion de correo y herramientas internas.',
    },
    {
        title: 'Asigna plan de onboarding',
        description: 'Define la ruta de aprendizaje de las primeras 4 semanas.',
    },
]

const onboardingTips = [
    {
        icon: ClipboardList,
        title: 'Agenda la primera reunion',
        description: 'Reserva una llamada de bienvenida durante las primeras 48 horas.',
    },
    {
        icon: UsersRound,
        title: 'Vincula con el equipo',
        description: 'Comparte el perfil del becario con el resto del equipo y asigna un buddy.',
    },
    {
        icon: Lightbulb,
        title: 'Define objetivos iniciales',
        description: 'Alinea expectativas con metas SMART y confirma los entregables del mes.',
    },
]

export default function Page() {
    return (
        <div className="space-y-10">
            <section className="flex flex-wrap items-end justify-between gap-6 mb-5">
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Alta de usuario
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight">Registrar nuevo usuario</h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Completa la ficha del usuario con los datos mas recientes. Esta informacion se comparte con talento humano y liderazgo para dar seguimiento al onboarding.
                    </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button form="create-user-form" type="reset" variant="outline">
                        Limpiar
                    </Button>
                    <Button form="create-user-form" type="submit">
                        Guardar usuario
                    </Button>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Datos del usuario</CardTitle>
                        <CardDescription>
                                    Guarda la informacion clave para registrar y acompanar el proceso.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreateUserForm showFooter={false} />
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Checklist previo</CardTitle>
                            <CardDescription>
                                Confirma estos pasos antes de finalizar la alta del becario.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {primaryActions.map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3"
                                >
                                    <CheckCircle2 className="mt-1 size-5 text-emerald-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-5">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle>Consejos de seguimiento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {onboardingTips.map((tip) => (
                                <div key={tip.title} className="flex items-start gap-3">
                                    <tip.icon className="mt-1 size-5 text-primary" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-5">{tip.title}</p>
                                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
                                <CheckCircle2 className="mt-1 size-5 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Programa recordatorios automaticos para revisar avances y registrar horas de voluntariado.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
