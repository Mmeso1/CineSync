/** @type {import('next').NextConfig} */
// next.config.js
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: isProd, // optional: strip console logs in prod
  },
};

module.exports = nextConfig;
