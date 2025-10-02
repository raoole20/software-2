"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Link from "next/link"

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

type InterFormValues = {
  cedula: string
  password: string
}

// Cédula venezolana típica: 7 u 8 dígitos (sin puntos)
const cedulaRegex = /^[0-9]{7,8}$/

const schema = yup.object({
  cedula: yup
    .string()
    .required("La cédula es requerida")
    .matches(cedulaRegex, "Cédula inválida: solo 7 u 8 dígitos"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
})

export default function LoginFormInter() {
  const form = useForm<InterFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { cedula: "", password: "" },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  async function onSubmit(values: InterFormValues) {
    // Reemplazar por llamada real a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log("Login Inter submit", values)
        resolve(true)
      }, 700)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="cedula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cédula</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: 12345678" />
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
                  <Input type="password" {...field} placeholder="••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="">
            <Button type="submit" disabled={isSubmitting} className="px-4 w-full">
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button> 

            <div className="flex items-center gap-3 w-full justify-center">
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

