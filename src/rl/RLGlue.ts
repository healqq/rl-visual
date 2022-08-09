import {
  Coordinate2D,
  create2DGrid,
  GameFieldElementKind,
  Grid2D,
  shape,
} from '../util/grid';
import { Policy, PolicyAction } from './Policy';
import RLAgent from './RLAgent';
import RLEnvironment from './RLEnvironment';

interface EpisodeRecord {
  steps: number;
  reward: number;
}

class RLGlue {
  private agent: RLAgent;

  private environment: RLEnvironment;

  private episodes: EpisodeRecord[];

  private dimensions: { x: number; y: number };

  private visits: Grid2D<number>;

  constructor(
    field: Grid2D<GameFieldElementKind>,
    initialState: Coordinate2D,
    policy: Policy
  ) {
    const fieldShape = shape(field);
    this.episodes = [];
    this.dimensions = { x: fieldShape[0], y: fieldShape[1] };
    this.visits = create2DGrid(
      {
        ...this.dimensions,
      },
      0
    );

    this.agent = new RLAgent(field, [...initialState], policy);
    this.environment = new RLEnvironment(field, [...initialState]);
  }

  private step(
    lastState: Coordinate2D,
    lastAction: PolicyAction
  ): {
    isTerminalState: boolean;
    state: Coordinate2D;
    nextAction: PolicyAction | null;
    reward: number;
  } {
    const step = this.environment.step(lastAction);
    let nextAction: PolicyAction | null = null;

    if (step.isTerminalState) {
      this.agent.end();
    } else {
      nextAction = this.agent.step(step.reward, step.currentState);
    }

    this.visits[lastState[0]][lastState[1]] += 1;

    return {
      isTerminalState: step.isTerminalState,
      state: step.currentState,
      nextAction,
      reward: step.reward,
    };
  }

  private runEpisode() {
    const episodeState: EpisodeRecord = {
      steps: 0,
      reward: 0,
    };

    let { state } = this.environment.reset();
    let action = this.agent.start(state);

    let step;
    do {
      step = this.step(state, action);
      // action can be null, but we don't run steps then anyway
      action = step.nextAction!;
      state = step.state;

      episodeState.steps += 1;
      episodeState.reward += step.reward;
    } while (step.isTerminalState === false);

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
    return this.agent.getOptimalPolicy();
  }

  public getOptimalQValues(): Grid2D<number> {
    return this.agent.getOptimalQValues();
  }

  public getStateVisitsMap(): Grid2D<number> {
    return this.visits;
  }
}

export default RLGlue;
