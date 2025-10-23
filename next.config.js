/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['profile.line-scdn.net'], // For LINE profile images
  },
}

module.exports = nextConfig
