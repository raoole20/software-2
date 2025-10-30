import { getSession } from '@/lib';
import React from 'react'

export default async function page() {
    const session = await getSession();
  return (
    <div>{
        JSON.stringify(session, null, 2)
    }</div>
  )
}
