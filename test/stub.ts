import { Socket, Connection } from '../src/Connection';
import { Room } from '../src/Room';

export class DummyRoom extends Room {
  public onJoin(connection) {}
  public onLeave(connection) {}
  public onMessage(connection, message: any) {}
}

export function createSocket(): Socket {
  return { send: (message) => {} }
}

export function createConnection(uid): Connection {
  return new Connection(uid, createSocket());
}
