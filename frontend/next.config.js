/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first")

const nextConfig = {
  reactStrictMode: false,
  experimental: {},
  ...withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
  }),
  experimental: {
    serverActions: true,
  }
};

module.exports = nextConfig;
