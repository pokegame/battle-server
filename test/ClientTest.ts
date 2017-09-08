import * as assert from 'assert';
import { createConnection, DummyRoom } from './stub';
import { Client } from '../src/Client';

describe('Client', function() {
  let connection, client, room;
  beforeEach(function() {
    connection = createConnection('u1');
    client = new Client(connection);
    room = new DummyRoom('r1');
  });

  it('should join room', function() {
    client.join(room);
    assert.equal(room.connections.has(connection), true);
  });

  it('should leave room', function() {
    client.join(room);
    client.leave(room);
    assert.equal(room.connections.has(connection), false);
  });
});
