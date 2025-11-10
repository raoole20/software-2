import { usersColumns } from './components/columns/user-column';

import UsersTableClient from '@/components/tables/UsersTableClient'
import { getAllUsers } from '@/server/users';
import React from 'react'
  

export default async function Page() {
  const users = await getAllUsers();
  return (
    <div>
      {/* UsersTableClient is a client component; Page stays a server component and can be async */}
      <UsersTableClient data={users} columns={usersColumns} />
    </div>
  )
}
