import { expect } from '@open-wc/testing';
import GreedyPolicy, { Policy, PolicyAction } from './Policy.js';

describe('Policy', () => {
  let instance: Policy;

  beforeEach(() => {
    instance = new GreedyPolicy(0);
  });

  it('should get correct action for the policy', () => {
    expect(instance.getActionForState([0.1, 5, 2, 1], 0)).equal(
      PolicyAction.RIGHT
    );
    expect(instance.getActionForState([-0.1, -5, -2, -1], 0)).equal(
      PolicyAction.TOP
    );
  });
});
