[Hosted on github pages](https://healqq.github.io/rl-visual/)

## RL agent for gridworld problem

JavaScript implementation for a TD RL agent learning optimal paths on a gridworld.
Inspired by [Reinforcement learning specialization](https://www.coursera.org/specializations/reinforcement-learning)

To regenerate a new random gridworld - click "apply". 

Amount of bombs is scaled bases on size of grid world.

To learn an agent - click on "run RL". Might take some time on slower devices or bigger grid sizes.


## Current state
- implemented a gridworld problem with some obstacles(bombs are bad for the agent)
- implemented SARSA agent with these parameters:
  - ε-greedy policy (starting with 0.5 and decaying over time)
  - 1000 episodes
  - no discounted reward
  - step size of 0.1

 
# Frontend

[Open Web Components](https://open-wc.org/) library is used for frontend. No specific reason for it, just wanted to give it a try :)
## Scripts

- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Web Test Runner
- `lint` runs the linter for your project

