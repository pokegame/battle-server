import * as assert from 'assert';
import * as sinon from 'sinon';
import { createConnection, DummyRoom } from './mock';
import { Connection } from '../src/Connection'

describe('Room', function() {
  const sandbox = sinon.sandbox.create();

  afterEach(function() {
    sandbox.restore();
  });

  it('should instantiate with empty connections', function() {
    const room = new DummyRoom('r1');
    assert.equal(room.connections.size, 0);
  });

  describe('join', function() {
    it('should add connection', function() {
      const connection = createConnection('u1');
      const room = new DummyRoom('r1');
      room.join(connection);

      assert.ok(room.connections.has(connection));
    });

    it('should call onJoin', function() {
      const connection = createConnection('u1');

      const mock = sinon.mock(DummyRoom.prototype);
      mock.expects('onJoin').once().withArgs(connection);

      const room = new DummyRoom('r1');
      room.join(connection);

      mock.verify();
    });
  });

  describe('leave', function() {
    it('should remove connection', function() {
      const connection = createConnection('u1');
      const room = new DummyRoom('r1');
      room.join(connection)();

      assert.equal(room.connections.has(connection), false);
    });

    it('should call onLeave', function() {
      const connection = createConnection('u1');

      const mock = sinon.mock(DummyRoom.prototype);
      mock.expects('onLeave').once().withArgs(connection);

      const room = new DummyRoom('r1');
      room.join(connection)();

      mock.verify();
    });
  });

  describe('send', function() {
    it('should send a message to the connection', function() {
      const expect = {
        room: 'r1',
        payload: {
          foo: 'bar'
        }
      };

      const connection = sinon.spy(Connection.prototype, 'send');
      const room = new DummyRoom('r1');
      room.send(createConnection('u1'), expect.payload);

      sinon.assert.calledWith(connection, expect);
    });
  });
});
