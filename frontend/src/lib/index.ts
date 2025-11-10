import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession, type Session } from "next-auth"

export const getSession = async (): Promise<Session | null> => {
    const session = await getServerSession(authOptions)
    return session
}

export type AppSession = Session