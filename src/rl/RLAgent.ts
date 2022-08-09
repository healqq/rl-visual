import { maxAtIndex } from '../util/array';
import {
  Coordinate2D,
  create3DGrid,
  GameFieldElementKind,
  Grid2D,
  Grid3D,
  shape,
} from '../util/grid';
import { Policy, PolicyAction } from './Policy';

class RLAgent {
  private actionValues: Grid3D<number>;

  private lastState: Coordinate2D;

  private lastAction!: PolicyAction;

  private policy: Policy;

  private stepSize: number = 0.1;

  private discount: number = 1;

  private dimensions: { x: number; y: number };

  private overallSteps: number = 0;

  private exporationCoefficient: number;

  constructor(
    field: Grid2D<GameFieldElementKind>,
    initialState: Coordinate2D,
    policy: Policy
  ) {
    const fieldShape = shape(field);
    this.dimensions = { x: fieldShape[0], y: fieldShape[1] };
    this.lastState = initialState;
    this.policy = policy;
    this.exporationCoefficient = this.dimensions.x * this.dimensions.y;
    this.actionValues = create3DGrid(
      {
        ...this.dimensions,
        z: this.policy.getActions().length,
      },
      0
    );
  }

  private getNextAction([x, y]: Coordinate2D): PolicyAction {
    const action = this.policy.getActionForState(
      this.actionValues[x][y],
      this.exporationCoefficient /
        (this.exporationCoefficient + Math.sqrt(this.overallSteps / 10))
    );

    return action;
  }

  private updateActionValueForState(
    payload:
      | {
          newState: Coordinate2D;
          lastState: Coordinate2D;
          newAction: PolicyAction;
          lastAction: PolicyAction;
          reward: number;
          isTerminal: false;
        }
      | {
          lastState: Coordinate2D;
          lastAction: PolicyAction;
          reward: number;
          isTerminal: true;
        }
  ): void {
    const { lastState, lastAction, reward } = payload;

    const qSt = this.actionValues[lastState[0]][lastState[1]][lastAction];

    let qSt1 = 0;
    if (!payload.isTerminal) {
      const { newState, newAction } = payload;

      qSt1 = this.actionValues[newState[0]][newState[1]][newAction];
    }

    this.actionValues[lastState[0]][lastState[1]][lastAction] =
      qSt +
      ((this.stepSize * this.exporationCoefficient) /
        (this.exporationCoefficient + Math.sqrt(this.overallSteps / 10))) *
        (reward + this.discount * qSt1 - qSt);
  }

  public start(state: Coordinate2D): PolicyAction {
    this.lastState = state;
    this.lastAction = this.getNextAction(state);
    return this.lastAction;
  }

  public step(reward: number, state: Coordinate2D): PolicyAction {
    if (this.lastAction === undefined) {
      throw new Error('Agent start was not called');
    }

    const newAction = this.getNextAction(state);

    this.updateActionValueForState({
      newState: state,
      lastState: this.lastState,
      lastAction: this.lastAction,
      newAction,
      reward,
      isTerminal: false,
    });

    this.lastState = [...state];
    this.lastAction = newAction;
    this.overallSteps += 1;

    return newAction;
  }

  public end() {
    this.updateActionValueForState({
      lastState: this.lastState,
      lastAction: this.lastAction,
      reward: 0,
      isTerminal: true,
    });
  }

  public getOptimalPolicy(): Grid2D<number> {
    console.log('steps', this.overallSteps);
    return this.actionValues.map(row => row.map(col => maxAtIndex(col)));
  }

  public getOptimalQValues(): Grid2D<number> {
    return this.actionValues.map(row => row.map(col => Math.max(...col)));
  }
}

export default RLAgent;
