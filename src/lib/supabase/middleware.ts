import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/registro'];

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isAdminUser(user: { email?: string; app_metadata?: Record<string, unknown> }) {
  const role = user.app_metadata?.role;
  const metadataAdmin = role === 'admin' || user.app_metadata?.is_admin === true;
  const allowlistAdmin = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
    .includes(user.email?.toLowerCase() || '');

  return metadataAdmin || allowlistAdmin;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApiPath = pathname.startsWith('/api/admin/');

  if (!user && (isAdminApiPath || (isAdminPath && !isPublicAdminPath(pathname)))) {
    if (isAdminApiPath) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (user && (isAdminApiPath || (isAdminPath && !isPublicAdminPath(pathname))) && !isAdminUser(user)) {
    if (isAdminApiPath) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.delete('next');
    return NextResponse.redirect(url);
  }

  return response;
}
