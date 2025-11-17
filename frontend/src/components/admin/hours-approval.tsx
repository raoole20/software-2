"use client";

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Hours } from '@/types/activiy';
import { Loader2 } from 'lucide-react';
import { aprobarRechazarHorasRegistro, getDetailsHorasRegistro, cambiarEstadoRegistroHoras } from '@/server/activities';

interface Props {
    data?: Hours;
    className?: string;
    onDone?: (estado: string) => void;
}

export function HoursApprovalControls({ data, className, onDone }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleAction = async (estado: 'A' | 'R') => {
        if (!data) return;
        // Usar helper que agrega campo accion y fecha_aprobacion correcta
        const res = await cambiarEstadoRegistroHoras(data, estado);
        if (!res.error) {
            toast.success(estado === 'A' ? 'Horas aprobadas' : 'Horas rechazadas');
            onDone?.(estado);
        } else {
            toast.error(res?.data?.detail || res.message || 'Error al cambiar estado');
        }
    };

    return (
        <div className={`flex flex-wrap gap-2 ${className || ''}`}>
            <Button
                variant="outline"
                disabled={isPending || !data}
                onClick={() => toast.info('Exportar no implementado aún')}
            >
                Exportar
            </Button>
            <Button
                disabled={isPending}
                type='button'
                onClick={() => handleAction('A')}
            >
                {isPending ? <Loader2 className="animate-spin size-4" /> : 'Aprobar'}
            </Button>
            <Button
                variant="destructive"
                disabled={isPending}
                type='button'
                onClick={() => handleAction('R')}
            >
                {isPending ? <Loader2 className="animate-spin size-4" /> : 'Rechazar'}
            </Button>
        </div>
    );
}
