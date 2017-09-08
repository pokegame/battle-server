import { Connection } from './Connection';

export abstract class Room {
  public roomId: string;
  public connections: Set<Connection>;

  public constructor(roomId: string) {
    this.roomId = roomId;
    this.connections = new Set();
  }

  public join(connection: Connection) {
    this.connections.add(connection);
    this.onJoin(connection);

    return () => {
      this.onLeave(connection);
      this.connections.delete(connection);
    }
  }

  public abstract onJoin(connection: Connection): void;
  public abstract onLeave(connection: Connection): void;
  public abstract onMessage(connection: Connection, message: any): void;

  public broadcast(payload: any) {
    this.connections.forEach((connection) => this.send(connection, payload));
  }

  public send(connection: Connection, payload: any) {
    connection.send({
      room: this.roomId,
      payload
    });
  }
}
