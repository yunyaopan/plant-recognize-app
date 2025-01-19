/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
  serverActions: {
    bodySizeLimit: "10mb",
  },
  experimental: {
    turbopack: false,
  },
};

module.exports = nextConfig;
