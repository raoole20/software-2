'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { motion } from 'motion/react';

export default function Layout({ children, modal }: { children: React.ReactNode, modal?: React.ReactNode }) {
    return (
        <div className='w-full max-w-[90%] md:max-w-sm space-y-5'>
            <motion.img
                src="/img/logo/logo.png"
                alt="Logo-avaa"
                width={200}
                height={200}
                className="mx-auto"
                style={{ width: '100%', height: 'auto', maxWidth: 200 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Tabs defaultValue="collaborator" className="w-full max-w-md mb-4 space-y-5">
                    <TabsList className='w-full'>
                        <TabsTrigger value="collaborator">Colaborador</TabsTrigger>
                    </TabsList>
                    <TabsContent value="collaborator" className="w-full flex justify-center">
                        {children}
                    </TabsContent>
                </Tabs>
            </motion.div>

            {modal}
        </div>
    )
}
