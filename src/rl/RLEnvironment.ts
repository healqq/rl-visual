import {
  Coordinate2D,
  GameFieldElementKind,
  Grid2D,
  shape,
} from '../util/grid';
import { PolicyAction } from './Policy';
import { rewardMap } from './problem';

// TODO: split agent and environment
class RLEnvironment {
  private field: Grid2D<GameFieldElementKind>;

  private initialState: Coordinate2D;

  private dimensions: { x: number; y: number };

  private state: Coordinate2D;

  constructor(field: Grid2D<GameFieldElementKind>, initialState: Coordinate2D) {
    const fieldShape = shape(field);
    this.dimensions = { x: fieldShape[0], y: fieldShape[1] };
    this.initialState = initialState;
    this.state = [...initialState];
    this.field = field;
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

  private isOutOfBounds([x, y]: Coordinate2D) {
    return x < 0 || x >= this.dimensions.x || y < 0 || y >= this.dimensions.y;
  }

  public step(action: PolicyAction) {
    let currentState = this.doAction(this.state, action);
    let isTerminalState = false;
    let reward: number;

    if (this.isOutOfBounds(currentState)) {
      reward = -100;
      currentState = [...this.state];
      isTerminalState = false;
    } else {
      const fieldType: GameFieldElementKind =
        this.field[currentState[0]][currentState[1]];

      isTerminalState = fieldType === GameFieldElementKind.FINISH;
      reward = rewardMap[fieldType];
    }

    this.state = currentState;

    return { reward, isTerminalState, currentState };
  }

  public reset(): { state: Coordinate2D } {
    this.state = [...this.initialState];
    return { state: [...this.state] };
  }
}

export default RLEnvironment;
