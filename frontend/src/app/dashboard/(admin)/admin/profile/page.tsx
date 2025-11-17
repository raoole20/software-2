import React from 'react'
import { getSession } from '@/lib'
import AdminUserProfileForm from './components/AdminUserProfileForm'

export default async function AdminProfilePage() {
  const session = await getSession()

  if (!session?.user?.id) {
    return <div>No autorizado</div>
  }

  // For admin's own profile, we can use the same component but allow editing
  // We'll pass a flag to indicate this is the admin's own profile
  return <AdminUserProfileForm userId={session.user.id.toString()} isOwnProfile={true} />
}