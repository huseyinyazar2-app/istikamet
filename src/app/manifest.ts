import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'İstikamet - Dijital Ayna',
    short_name: 'İstikamet',
    description: 'Nefis Muhasebesi ve Dijital Ayna',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A1128',
    theme_color: '#0A1128',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
