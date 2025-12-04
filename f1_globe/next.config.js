const nextConfig = {
  output: 'export',
  basePath: '/f1_globe',       // Ensures routing is relative to /f1_globe
  assetPrefix: '/f1_globe',    // Ensures static assets are loaded correctly
  trailingSlash: true,         // Ensures consistent trailing slashes for paths (optional)
};

module.exports = nextConfig;