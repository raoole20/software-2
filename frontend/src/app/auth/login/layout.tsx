import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='w-full max-w-[90%] md:max-w-sm space-y-5'>
            <img
                src="/img/logo/logo.png"
                alt="Logo-avaa"
                width={200}
                height={200}
                className="mx-auto"
                style={{ width: '100%', height: 'auto', maxWidth: 200 }}
            />
            <Tabs defaultValue="collaborator" className="w-full max-w-md mb-4 space-y-5">
                <TabsList className='w-full'>
                    <TabsTrigger value="collaborator">Colaborador</TabsTrigger>
                </TabsList>
                <TabsContent value="collaborator" className="w-full flex justify-center">
                    {children}
                </TabsContent>
            </Tabs>
        </div>
    )
}
