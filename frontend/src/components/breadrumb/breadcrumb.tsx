'use client'
import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import React from "react"

export function BreadcrumbAdmin() {
    const pathname = usePathname()

    // Aquí puedes agregar tu lógica para generar los breadcrumbs
    // Por ejemplo, dividir el path:
    const segments = pathname.split("/").filter(Boolean)

    return (
        <Breadcrumb className="px-4 py-2">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {
                    segments.map((segment, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/${segments.slice(0, index + 1).join("/")}`}>
                                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}
