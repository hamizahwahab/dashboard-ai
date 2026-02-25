import type { NextConfig } from "next";

const NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true, // This tells browsers to remember the redirect
      },
    ]
  },
};

export default NextConfig;
