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
};

module.exports = nextConfig;
