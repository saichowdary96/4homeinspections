/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export so the site can be uploaded to any shared host
  // (GoDaddy, cPanel, Netlify drop, S3, etc.) without a Node server.
  // To re-enable server features later (API routes, ISR, image
  // optimization), simply remove `output: 'export'`.
  output: "export",

  // Static export cannot use the Next.js Image Optimization server,
  // so we serve images unoptimized. Replace with a CDN/loader later.
  images: {
    unoptimized: true,
  },

  // Emit `/about/index.html` instead of `/about.html` so deep links work
  // correctly on Apache/Nginx static hosts like GoDaddy.
  trailingSlash: true,

  reactStrictMode: true,
};

export default nextConfig;
