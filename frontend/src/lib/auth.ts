import { signIn as nextSignIn, signOut as nextSignOut } from 'next-auth/react'
import type { SignInResponse } from 'next-auth/react'

export async function signIn(email: string, password: string) {
  const res = (await nextSignIn('credentials', { redirect: false, email, password })) as SignInResponse | undefined
  return res
}

export function signOut() {
  return nextSignOut({ redirect: true, callbackUrl: '/' })
}
