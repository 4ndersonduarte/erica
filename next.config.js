function getSupabaseHostname() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  } catch {
    return null;
  }
}

const supabaseHostname = getSupabaseHostname();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      ...(supabaseHostname
        ? [{ protocol: 'https', hostname: supabaseHostname, pathname: '/**' }]
        : []),
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;
