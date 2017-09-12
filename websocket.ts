import * as socketio from 'socket.io';
import * as socketioJwt from 'socketio-jwt-auth';
import { Server } from 'http';
import { Client } from './src/Client';
import { Connection } from './src/Connection';

export function attach(httpServer: Server, {
  rooms,
  secretKey
}) {
  const io = socketio(httpServer);

  io.use(
    socketioJwt.authenticate({
      secret: secretKey,
      algorithm: 'RS256'
    }, (payload, cb) => {
      if (!payload.user_id) {
        return cb('Malformed token.');
      }

      return cb(null, payload);
    })
  );

  io.on('connection', (socket) => {
    const connection = new Connection(socket.request.user.user_id, socket);
    const client = new Client(connection);

    socket.on('join', (roomid) => {
      onRoom(roomid, (room) => client.join(room));
    });

    socket.on('leave', (roomid) => {
      onRoom(roomid, (room) => client.leave(room));
    });

    socket.on('data', (roomid, data) => {
      onRoom(roomid, (room) => room.onMessage(connection, data));
    });

    socket.on('whoami', (cb) => {
      if (typeof cb === 'function') {
        cb(connection.uid);
      }
    });

    socket.on('disconnect', () => {
      client.leaveAll();
    });
  });

  function onRoom(roomid, cb) {
    const room = rooms.get(roomid);
    if (room !== undefined) {
      cb(room);
    }
  }
}
