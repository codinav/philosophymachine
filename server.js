// Production server entry for Node hosts that need an explicit startup file
// (Hostinger "Setup Node.js App" / CloudLinux Node Selector / Passenger / cPanel).
//
// Prereq: run `npm install` (incl. devDependencies) and `npm run build` first.
// Hosts that can run `npm start` directly may use that (`next start`) instead
// and ignore this file. Listens on the port the host provides via PORT.

const { createServer } = require('http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOST || '0.0.0.0';

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`> The Philosophy Machine ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  });
