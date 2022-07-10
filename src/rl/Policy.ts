import { maxAtIndex } from '../util/array';

export enum PolicyAction {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3,
}

export interface Policy {
  getActionForState(
    actionValuesForState: number[],
    greediness: number
  ): PolicyAction;
  getActions(): PolicyAction[];
}

class GreedyPolicy implements Policy {
  private actions = [
    PolicyAction.TOP,
    PolicyAction.RIGHT,
    PolicyAction.BOTTOM,
    PolicyAction.LEFT,
  ];

  constructor(private eps: number = 0.1) {}

  public getActionForState(
    actionValuesForState: number[],
    greediness: number
  ): PolicyAction {
    const isRandomAction = Math.random() < this.eps * greediness;

    if (isRandomAction) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    }
    // console.log('policy-qv', actionValuesForState);
    const result = this.actions[maxAtIndex(actionValuesForState)];
    // console.log('poicty-new-action', result);

    return result;
  }

  public getActions(): PolicyAction[] {
    return this.actions;
  }
}

export default GreedyPolicy;
