'use client'
import { motion } from "motion/react"
import LogoAnimated from "@/components/LogoAnimated"
import Particles from "@/components/Particles"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center p-4"
      onClick={() => {
        router.push("/auth/login");
      }}
    >
      <div className="h-auto w-auto flex flex-col items-center relative">
        <Particles count={56} color="#224E7D" />
        <LogoAnimated size={320} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: [0.9, 1.08, 1] }}
          transition={{
            delay: 1.8,
            opacity: { duration: 0.3 },
            scale: { duration: 0.9, times: [0, 0.6, 1], ease: ["easeOut", "easeInOut"] }
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] aspect-square h-auto" 
          >
          <Image src={'/img/manos.png'} alt="ava" width={320} height={320} priority className="w-full" />
        </motion.div>
      </div>
    </motion.main>
  )
}
