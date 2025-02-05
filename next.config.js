/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
  output: 'standalone',
  images: {
    domains: ['seu-dominio-de-imagens.com'], // Adicione os domínios das suas imagens aqui
  },
}

module.exports = nextConfig 