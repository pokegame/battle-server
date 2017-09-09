import * as assert from 'assert';
import * as sinon from 'sinon';
import { createConnection } from './stub';
import { BattleRoom } from '../src/BattleRoom';

const players = [{
  name: 'trainer-1',
  partyMembers: [
    {
      name: 'pokemon-1-1',
      species: 'charmander',
      level: 8,
      gender: 'female',
      evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
      ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
      moves: ['tackle']
    },
    {
      name: 'pokemon-1-2',
      species: 'squirtle',
      level: 10,
      gender: 'male',
      evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
      ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
      moves: ['tackle']
    }
  ]
}, {
  name: 'trainer-2',
  partyMembers: [
    {
      name: 'pokemon-2-1',
      species: 'bulbasaur',
      level: 5,
      gender: 'male',
      evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
      ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
      moves: ['tackle']
    }
  ]
}];

describe('BattleRoom', function() {
  const sandbox = sinon.sandbox.create();

  afterEach(function() {
    sandbox.restore();
  });

  it('should instantiate from players', function() {
    const room = BattleRoom.createFromPlayers('r1', players);
    assert.ok(room instanceof BattleRoom);
  });

  describe('join', function() {
    it('should receive initial battle state', function() {
      const connection = createConnection('spectator');
      const spy = sinon.spy(connection, 'send');

      const room = BattleRoom.createFromPlayers('r1', players);
      room.join(connection);

      sinon.assert.calledWithMatch(spy, {
        room: 'r1',
        payload: {
          type: 'INITIAL_BATTLE_STATE'
        }
      });
    });

    it('should receive choices when user is a player', function() {
      const connection = createConnection(players[0].name);
      const spy = sinon.spy(connection, 'send');

      const room = BattleRoom.createFromPlayers('r1', players);
      room.join(connection);

      sinon.assert.calledWithMatch(spy, {
        room: 'r1',
        payload: {
          type: 'REQUEST_DECISION'
        }
      });
    });
  });
});
