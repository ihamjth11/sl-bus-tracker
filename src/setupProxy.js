const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/claude',
    createProxyMiddleware({
      target: 'https://api.anthropic.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/claude': '/v1/messages',
      },
      on: {
        proxyReq: (proxyReq) => {
          proxyReq.setHeader('x-api-key', 'AQ.Ab8RN6KraOTplYCrdfpSWJi0vUnl5MsrVPAlGgL9O4kCvTudFA);
          proxyReq.setHeader('anthropic-version', '2023-06-01');
          proxyReq.setHeader('content-type', 'application/json');
        },
      },
    })
  );
};