/** @type {import('next').NextConfig} */
const nextConfig = {
  serverActions: {
    bodySizeLimit: '10mb', // Set the body size limit to 10MB
  },
};

module.exports = nextConfig; 