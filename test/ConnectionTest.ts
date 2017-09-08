import * as assert from 'assert';
import * as sinon from 'sinon';
import { createSocket } from './stub';
import { Connection } from '../src/Connection';

describe('Connection', function() {
  const socket = createSocket();

  it('should send message to the socket', function() {
    const expected = 'Lorem ipsum dolor sit amet';

    const mock = sinon.mock(socket);
    mock.expects('send').once().withArgs(expected);

    const connection = new Connection('uid', socket);
    connection.send(expected);

    mock.verify();
  });

  it('should not allow empty user id', function() {
    assert.throws(function() {
      const connection = new Connection('', socket);
    }, Error)
  });
});
