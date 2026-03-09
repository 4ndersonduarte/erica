import { getSession } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="min-h-screen bg-dark-50">
      <main className={session ? 'container-custom py-6 sm:py-8 px-4 sm:px-6 max-w-5xl mx-auto' : ''}>
        {children}
      </main>
    </div>
  );
}
