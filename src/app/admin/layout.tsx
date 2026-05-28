import { getSession } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="min-h-screen bg-cream">
      {session && <AdminNav />}
      <main className={session ? 'container-custom max-w-6xl py-6 sm:py-8' : ''}>
        {children}
      </main>
    </div>
  );
}
