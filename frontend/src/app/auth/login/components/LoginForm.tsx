"use client"

import React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"

import { yupResolver } from "@hookform/resolvers/yup"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { AuthLoginType } from "@/types"
import { AuthLoginSchema } from "@/lib/validators"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import PasswordInput from "@/components/common/password-input"


export default function LoginForm() {
    const router = useRouter();
    
    const form = useForm<AuthLoginType>({
        resolver: yupResolver(AuthLoginSchema),
        defaultValues: { email: "", password: "" },
    })

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form

    async function onSubmit(values: AuthLoginType) {
        const result = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
        })

        if (result?.error) {
            toast.error("Login failed. Please check your credentials.")
            return
        }

        toast.success("Logged in successfully!");
        router.push("/dashboard/");
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
                <div className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="tucorreo@ejemplo.com" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <PasswordInput {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between flex-col space-y-2">
                        <Button type="submit" disabled={isSubmitting} className="px-4 w-full">
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </Button>

                        <div className="flex items-center gap-3">
                            <Link href="#" className="text-sm text-primary underline-offset-2 hover:underline">
                                Olvidé mi contraseña
                            </Link>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link href="#" className="text-sm text-muted-foreground">
                            ¿No tienes cuenta? <span className="text-primary">Regístrate</span>
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    )
}
