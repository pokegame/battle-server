import * as express from 'express';
import { createServer } from 'http';
import { attachApi } from './web';
import { attachWss } from './websocket';

export function serve({
  rooms,
  pubKey
}) {
  const app = express();
  const httpServer = createServer(app);

  attachApi(app, {
    rooms
  });

  attachWss(httpServer, {
    rooms,
    pubKey
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
  }
