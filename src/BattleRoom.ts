import { Connection } from './Connection';
import * as Protocol from './Protocol';
import { Room } from './Room';
import { createBattle, createState, decisions } from 'pokemon-battle-engine';

export class BattleRoom extends Room {
  private battleState: any;
  private request: any;

  public static createFromState(roomId, battleState): BattleRoom {
    return new BattleRoom(roomId, battleState);
  }

  public static createFromPlayers(roomId, players): BattleRoom {
    return BattleRoom.createFromState(roomId, createState(...players));
  }

  private constructor(roomId: string, initState: any) {
    super(roomId);

    this.setState(initState);
    this.setRequest({}, () => {});

    createBattle(this.battleState).start(
      (battleState, listener) => {
        listener((choices, dispatch) => this.setRequest(choices, dispatch));
        this.setState(battleState);
      },
      (error) => {
        console.log('battle error', this.roomId, error.message);
      },
      () => {
        console.log('battle complete', this.roomId);
      }
    );
  }

  public onJoin(connection: Connection) {
    // @TODO: filter the battle state in function of the user
    this.send(connection, {
      type: Protocol.INITIAL_BATTLE_STATE,
      battleState: this.battleState,
    });

    if (connection.uid in this.request.choices) {
      this.send(connection, {
        type: Protocol.REQUEST_DECISION,
        choices: this.request.choices[connection.uid]
      });
    }
  }

  public onLeave(connection: Connection) {}

  public onMessage(connection: Connection, message: any) {
    if (!this.battleState.actors.includes(connection.uid)) {
      return;
    }

    const decision =
      message.type === 'attack' ? decisions.createAttackDecision(connection.uid, message.move) :
      message.type === 'switch' ? decisions.createSwitchDecision(connection.uid, message.pokemon) :
      undefined;

    if (decision === undefined) {
      return;
    }

    this.request.dispatch(decision, (errorMessage) => {
      this.send(connection, {
        type: Protocol.DECISON_ERROR,
        errorMessage
      });
    });
  }

  private setState(state) {
    this.battleState = state;

    this.connections.forEach((connection) => {
      // @TODO: filter the state and send just the delta
      this.send(connection, {
        type: Protocol.UPDATE_BATTLE_STATE,
        battleState: this.battleState
      });
    });
  }

  private setRequest(choices, dispatch) {
    this.request = { choices, dispatch };

    this.connections.forEach((connection) => {
      if (!(connection.uid in this.request.choices)) {
        return;
      }

      this.send(connection, {
        type: Protocol.REQUEST_DECISION,
        choices: this.request.choices[connection.uid]
      });
    });
  }
}
