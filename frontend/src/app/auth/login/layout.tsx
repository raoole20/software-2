import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';


export default function Layout({ children, inter }: { children: React.ReactNode, inter: React.ReactNode }) {
    return (
        <div className='w-full max-w-[90%] md:max-w-sm space-y-5'>
            {/* Use next/image with responsive styling. We keep width/height for optimization
                but allow the rendered image to scale down via CSS. */}
            <Image
                src="/img/logo/logo.png"
                alt="Logo-avaa"
                width={200}
                height={200}
                className="mx-auto"
                style={{ width: '100%', height: 'auto', maxWidth: 200 }}
                priority
            />
            <Tabs defaultValue="collaborator" className="w-full max-w-md mb-4 space-y-5">
                <TabsList className='w-full'>
                    <TabsTrigger value="collaborator">Colaborador</TabsTrigger>
                    {/* <TabsTrigger value="inter">Becario</TabsTrigger> */}
                </TabsList>
                {/* <TabsContent value="inter" className="w-full flex justify-center">
                    {inter}
                </TabsContent> */}
                <TabsContent value="collaborator" className="w-full flex justify-center">
                    {children}
                </TabsContent>
            </Tabs>
        </div>
    )
}
