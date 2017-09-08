import { Room } from './Room';
import { Connection } from './Connection';

export class Client {
  private rooms: Map<string, () => void>;

  public constructor(private connection: Connection) {
    this.rooms = new Map();
  }

  public join(room: Room) {
    const leave = room.join(this.connection);
    this.rooms.set(room.roomId, leave);
  }

  public leave(room: Room) {
    const leave = this.rooms.get(room.roomId);
    if (typeof leave === "function") {
      leave();
    }
  }

  public leaveAll() {
    this.rooms.forEach((leave) => leave());
    this.rooms.clear();
  }
}
