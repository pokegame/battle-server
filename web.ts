import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Server } from 'http';
import * as uuid from 'uuid/v4';
import { BattleRoom } from './src/BattleRoom';

export function attachApi(app: express.Application, {
  rooms
}) {
  // @TODO - API authorization + error handling

  app.use(bodyParser.json({ type: 'application/json' }));

  app.get('/battles', (req, res) => {
    res.json({
      rooms: Array.from(rooms.keys())
    });
  });

  app.post('/battles', (req, res) => {
    const roomId = uuid();
    const battleRoom = BattleRoom.createFromPlayers(roomId, req.body.players);
    rooms.set(roomId, battleRoom);

    res.statusCode = 201;
    res.json({ roomId });
  });
};
