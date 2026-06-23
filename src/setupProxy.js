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
          proxyReq.setHeader('x-api-key', 'REMOVED');
          proxyReq.setHeader('anthropic-version', '2023-06-01');
          proxyReq.setHeader('content-type', 'application/json');
        },
      },
    })
  );
};