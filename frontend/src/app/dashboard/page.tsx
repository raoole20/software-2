import { getSession } from '@/lib'
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

export default async function page() {
  // dashboard administrativo
  const session = await getSession();

  if (!session) {
    toast.info("Please log in to access the dashboard.");
  }

  if (session?.user?.rol === 'administrador') {
    redirect('/dashboard/admin/overview');
  }

  return redirect('/dashboard/interns/overview');
}
