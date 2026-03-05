import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="min-h-screen bg-dark-50">
      {session ? (
        <>
          <AdminNav />
          <main className="container-custom py-8">{children}</main>
        </>
      ) : (
        <main>{children}</main>
      )}
    </div>
  );
}
