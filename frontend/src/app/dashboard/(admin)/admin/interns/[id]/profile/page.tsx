import React from 'react'
import { getUserById } from '@/server/users'
import AdminUserProfileForm from './components/AdminUserProfileForm'

interface PageProps {
  params: {
    id: string
  }
}

export default async function AdminUserProfilePage({ params }: PageProps) {
  const { id } = params
  const userId = parseInt(id)

  if (isNaN(userId)) {
    return <div>ID de usuario inválido</div>
  }

  try {
    const user = await getUserById(userId)
    return <AdminUserProfileForm user={user} />
  } catch (error) {
    console.error('Error fetching user:', error)
    return <div>Error al cargar el usuario</div>
  }
}