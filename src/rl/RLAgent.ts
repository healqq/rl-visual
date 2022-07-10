import { maxAtIndex } from '../util/array';
import {
  Coordinate2D,
  create2DGrid,
  create3DGrid,
  GameFieldElementKind,
  Grid2D,
  Grid3D,
  shape,
} from '../util/grid';
import { Policy, PolicyAction } from './Policy';
import { rewardMap } from './problem';

interface EpisodeRecord {
  steps: number;
  reward: number;
}

// TODO: split agent and environment
class RLAgent {
  private field: Grid2D<GameFieldElementKind>;

  private actionValues: Grid3D<number>;

  private initialState: Coordinate2D;

  private episodes: EpisodeRecord[];

  private policy: Policy;

  private stepSize: number = 0.1;

  private discount: number = 1;

  private dimensions: { x: number; y: number };

  private overallSteps: number = 0;

  private exporationCoefficient: number;

  private visits: Grid2D<number>;

  constructor(
    field: Grid2D<GameFieldElementKind>,
    initialState: Coordinate2D,
    policy: Policy
  ) {
    const fieldShape = shape(field);
    this.episodes = [];
    this.dimensions = { x: fieldShape[0], y: fieldShape[1] };
    this.initialState = initialState;
    this.field = field;
    this.policy = policy;
    this.exporationCoefficient = this.dimensions.x * this.dimensions.y;
    this.actionValues = create3DGrid(
      {
        ...this.dimensions,
        z: this.policy.getActions().length,
      },
      0
    );
    this.visits = create2DGrid(
      {
        ...this.dimensions,
      },
      0
    );
  }

  private doAction([x, y]: Coordinate2D, action: PolicyAction): Coordinate2D {
    switch (action) {
      case PolicyAction.LEFT:
        return [x - 1, y];
      case PolicyAction.TOP:
        return [x, y - 1];
      case PolicyAction.RIGHT:
        return [x + 1, y];
      case PolicyAction.BOTTOM:
        return [x, y + 1];
    }
  }

  private getNextAction([x, y]: Coordinate2D): PolicyAction {
    const action = this.policy.getActionForState(
      this.actionValues[x][y],
      this.exporationCoefficient /
        (this.exporationCoefficient + Math.sqrt(this.overallSteps))
    );

    return action;
  }

  private updateActionValueForState({
    newState,
    lastState,
    lastAction,
    newAction,
    reward,
    isTerminal,
  }: {
    newState: Coordinate2D;
    lastState: Coordinate2D;
    newAction: PolicyAction;
    lastAction: PolicyAction;
    reward: number;
    isTerminal: boolean;
  }): void {
    // console.log('last state', lastState);
    // console.log('before update', this.actionValues[lastState[0]][lastState[1]]);
    // console.log('action', PolicyAction[lastAction]);
    // console.log('new state', newState);
    // console.log('new state Q', this.actionValues[newState[0]][newState[1]]);
    // console.log('new action', PolicyAction[lastAction]);
    const qSt = this.actionValues[lastState[0]][lastState[1]][lastAction];
    const qSt1 = isTerminal
      ? 0
      : this.actionValues[newState[0]][newState[1]][newAction];
    this.actionValues[lastState[0]][lastState[1]][lastAction] =
      qSt + this.stepSize * (reward + this.discount * qSt1 - qSt);
    // console.log('after update', this.actionValues[lastState[0]][lastState[1]]);
  }

  private isOutOfBounds([x, y]: Coordinate2D) {
    return x < 0 || x >= this.dimensions.x || y < 0 || y >= this.dimensions.y;
  }

  private runEpisode(): EpisodeRecord {
    const episodeState: EpisodeRecord = {
      steps: 0,
      reward: 0,
    };

    let isTerminalState = false;
    let lastState: Coordinate2D = [...this.initialState];
    let lastAction = this.getNextAction(lastState);

    while (!isTerminalState) {
      let currentState = this.doAction(lastState, lastAction);
      let reward: number;
      // eslint-disable-next-line prefer-const

      if (this.isOutOfBounds(currentState)) {
        // console.log(currentState);
        reward = -100;
        currentState = [...lastState];
        isTerminalState = false;
      } else {
        const fieldType: GameFieldElementKind =
          this.field[currentState[0]][currentState[1]];

        isTerminalState = fieldType === GameFieldElementKind.FINISH;
        reward = rewardMap[fieldType];
      }

      const newAction = this.getNextAction(currentState);

      // isTerminalState = episodeState.steps > 15;

      this.updateActionValueForState({
        newState: currentState,
        lastState,
        lastAction,
        newAction,
        reward,
        isTerminal: isTerminalState,
      });

      // if (this.overallSteps % 1000 === 0) {
      // console.log(
      //   lastState,
      //   PolicyAction[lastAction],
      //   newState,
      //   PolicyAction[newAction],
      //   this.actionValues[lastState[0]][lastState[1]],
      //   this.actionValues[newState[0]][newState[1]],
      //   isTerminalState);
      // }

      // console.log({
      //   qSt: this.actionValues[lastState[0]][lastState[1]][lastAction],
      //   qSt1: this.actionValues[newState[0]][newState[1]][newAction],
      //   newAction,
      //   reward,
      //   isTerminal: isTerminalState,
      // });

      lastState = currentState;
      lastAction = newAction;
      episodeState.steps += 1;
      episodeState.reward += reward;
      this.overallSteps += 1;
      this.visits[lastState[0]][lastState[1]] += 1;
    }

    return episodeState;
  }

  public runEpisodes(count: number): Promise<EpisodeRecord[]> {
    return new Promise(resolve => {
      for (let i = 0; i < count; i += 1) {
        this.episodes.push(this.runEpisode());
      }

      resolve(this.episodes.slice(-count));
    });
  }

  public getOptimalPolicy(): Grid2D<number> {
    return this.actionValues.map(row => row.map(col => maxAtIndex(col)));
  }

  public getOptimalQValues(): Grid2D<number> {
    return this.actionValues.map(row => row.map(col => Math.max(...col)));
  }

  public getStateVisitsMap(): Grid2D<number> {
    return this.visits;
  }
}

export default RLAgent;
