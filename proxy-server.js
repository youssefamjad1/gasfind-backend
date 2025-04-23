import express from 'express';
import httpProxy from 'http-proxy';

const app = express();
const proxy = httpProxy.createProxyServer();
const PORT = 5000;

app.use((req, res) => {
  proxy.web(req, res, { target: 'http://localhost:5000' }); // Adjust if necessary
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
