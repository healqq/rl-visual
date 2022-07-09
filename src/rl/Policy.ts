export enum PolicyAction {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3,
}

const maxAtIndex = (array: number[]): number => {
  let maxIndex = 0;
  let max = array[0];
  for (let i = 1; i < array.length; i += 1) {
    if (array[i] > max) {
      max = array[i];
      maxIndex = i;
    }
  }

  return maxIndex;
};

export interface Policy {
  getActionForState(actionValuesForState: number[]): PolicyAction;
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

  public getActionForState(actionValuesForState: number[]): PolicyAction {
    const isRandomAction = Math.random() < this.eps;

    if (isRandomAction) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    }

    return this.actions[maxAtIndex(actionValuesForState)];
  }

  public getActions(): PolicyAction[] {
    return this.actions;
  }
}

export default GreedyPolicy;
