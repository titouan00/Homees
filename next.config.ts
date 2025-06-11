/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // Images Unsplash (déjà existant)
      'images.unsplash.com',
      // Discord CDN pour les images de test
      'cdn.discordapp.com',
      // Supabase Storage pour les images uploadées
      'pxgrmndfgxhoedppkaul.supabase.co',
      // Google Images/Maps
      'maps.googleapis.com',
      'lh3.googleusercontent.com',
      // Autres CDN populaires
      'picsum.photos',
      'via.placeholder.com',
      // Domaines locaux pour le développement
      'localhost',
      '127.0.0.1'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/attachments/**',
      }
    ]
  },
};

export default nextConfig;
