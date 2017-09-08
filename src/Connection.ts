export interface Socket {
  send: (message: string) => void;
}

export class Connection {
  public constructor(private userId: string, private socket: Socket) {
    if (!userId) {
      throw new Error('User ID cannot be empty.');
    }
  }

  public get uid() {
    return this.userId;
  }

  public send(message) {
    this.socket.send(message);
  }
}
