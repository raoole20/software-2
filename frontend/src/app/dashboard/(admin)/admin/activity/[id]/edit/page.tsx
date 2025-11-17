import React from 'react'
import { getActivityById } from '@/server/activities'
import { getAllUsers } from '@/server/users'
import AdminActivityEditForm from './components/AdminActivityEditForm'

interface PageProps {
  params: {
    id: string
  }
}

export default async function AdminActivityEditPage({ params }: PageProps) {
  const { id } = params
  const activityId = parseInt(id)

  if (isNaN(activityId)) {
    return <div>ID de actividad inválido</div>
  }

  try {
    const [activity, allUsers] = await Promise.all([
      getActivityById(activityId),
      getAllUsers()
    ])
    return <AdminActivityEditForm activity={activity} allUsers={allUsers} />
  } catch (error) {
    console.error('Error fetching data:', error)
    return <div>Error al cargar los datos</div>
  }
}