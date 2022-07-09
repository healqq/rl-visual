import {
  Coordinate2D,
  create3DGrid,
  GameFieldElementKind,
  Grid2D,
  Grid3D,
} from '../util/grid';
import { Policy, PolicyAction } from './Policy';
import { rewardMap } from './problem';

interface EpisodeRecord {
  steps: number;
}
class RLAgent {
  private field: Grid2D<GameFieldElementKind>;

  private actionValues: Grid3D<number>;

  private initialState: Coordinate2D;

  private episodes: EpisodeRecord[];

  private policy: Policy;

  private stepSize: number = 0.01;

  private discount: number = 1;

  private dimensions: { x: number; y: number };

  constructor(
    field: Grid2D<GameFieldElementKind>,
    initialState: Coordinate2D,
    policy: Policy
  ) {
    this.episodes = [];
    this.dimensions = { x: field.length, y: field[0].length };
    this.initialState = initialState;
    this.field = field;
    this.policy = policy;
    this.actionValues = create3DGrid(
      {
        ...this.dimensions,
        z: this.policy.getActions().length,
      },
      0
    );
  }

  private doAction([x, y]: Coordinate2D, action: PolicyAction): Coordinate2D {
    switch (action) {
      case PolicyAction.LEFT:
        return [Math.max(x - 1, 0), y];
      case PolicyAction.TOP:
        return [x, Math.max(y - 1, 0)];
      case PolicyAction.RIGHT:
        return [Math.min(x + 1, this.dimensions.x - 1), y];
      case PolicyAction.BOTTOM:
        return [x, Math.min(y + 1, this.dimensions.y - 1)];
    }
  }

  private doStep([x, y]: Coordinate2D): [Coordinate2D, PolicyAction] {
    const action = this.policy.getActionForState(this.actionValues[x][y]);

    const newState = this.doAction([x, y], action);

    return [newState, action];
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
    const qSt = this.actionValues[lastState[0]][lastState[1]][lastAction];
    const qSt1 = isTerminal
      ? this.actionValues[newState[0]][newState[1]][newAction]
      : 0;
    this.actionValues[lastState[0]][lastState[1]][lastAction] =
      qSt + this.stepSize * (reward + this.discount * qSt1 - qSt);
  }

  private runEpisode(): EpisodeRecord {
    const episodeState: EpisodeRecord = {
      steps: 0,
    };

    let isTerminalState = false;
    let currentAction = Math.floor(Math.random() * 4);
    let currentState: Coordinate2D = [...this.initialState];
    while (!isTerminalState) {
      const [newState, newAction] = this.doStep(currentState);

      const fieldType: GameFieldElementKind =
        this.field[newState[0]][newState[1]];

      isTerminalState = fieldType === GameFieldElementKind.FINISH;
      const reward = rewardMap[fieldType];

      this.updateActionValueForState({
        newState,
        lastState: currentState,
        lastAction: currentAction,
        newAction,
        reward,
        isTerminal: isTerminalState,
      });

      currentState = newState;
      currentAction = newAction;
      episodeState.steps += 1;
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
    return this.actionValues.map(row => row.map(col => Math.max(...col)));
  }
}

export default RLAgent;
