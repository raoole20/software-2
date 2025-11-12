import React from 'react'
import { Input } from '../ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

interface PasswordInputProps extends React.ComponentProps<'input'> {
    /** Texto alternativo accesible para el botón (mostrar/ocultar) */
    toggleAriaLabel?: string
}

export default function PasswordInput({ toggleAriaLabel, className, ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
        <div className="relative">
            <Input
                {...props}
                type={showPassword ? 'text' : 'password'}
                placeholder={props.placeholder ?? '••••••••'}
                className={cn('pr-10', className)}
                aria-invalid={props['aria-invalid']}
            />

            <Button
                type="button"
                aria-label={toggleAriaLabel ?? (showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña')}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPassword((s) => !s)}
                variant={'ghost'}
                className='absolute right-2 bg-transparent hover:bg-transparent!'
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
        </div>
    )
}
