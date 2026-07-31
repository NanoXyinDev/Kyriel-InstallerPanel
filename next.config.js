/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['ssh2'],
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
