import {
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  LogarithmicScale,
} from 'chart.js';
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EpisodeRecord } from './rl/RLGlue';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  LogarithmicScale,
  Title
);

const getChartConfig = (label: string): ChartConfiguration => ({
  type: 'line',
  options: {
    responsive: false,
    scales: {
      x: {
        display: true,
        type: 'linear',
      },
      y: {
        display: true,
        type: 'logarithmic',
      },
    },
  },
  data: {
    datasets: [{ data: [], label, backgroundColor: '#330066' }],
  },
});

const getRewardFromEpisode = (episode: EpisodeRecord, index: number) => ({
  x: index,
  y: -episode.reward,
});

const getStepsFromEpisode = (episode: EpisodeRecord, index: number) => ({
  x: index,
  y: episode.steps,
});

@customElement('rl-visual-stats')
export class Grid extends LitElement {
  protected rewardChartRef!: Chart;

  protected stepsChartRef!: Chart;

  @property({ attribute: false })
  protected episodes!: EpisodeRecord[];

  static styles = css`
    .stats {
      display: grid;
      background: #ccc;
      gap: 12px;
      grid-template-columns: 1fr;
      grid-template-rows: max-content;
      grid-auto-rows: 1fr;
    }
  `;

  firstUpdated() {
    const ctxReward = this.renderRoot.querySelector('#reward-chart');
    const ctxSteps = this.renderRoot.querySelector('#steps-chart');
    if (!ctxReward || !ctxSteps) {
      return;
    }

    this.rewardChartRef = new Chart(
      ctxReward as HTMLCanvasElement,
      getChartConfig('reward')
    );
    this.stepsChartRef = new Chart(
      ctxSteps as HTMLCanvasElement,
      getChartConfig('steps')
    );
  }

  // willUpdate() {
  //   console.log('q');
  // }

  update(props: Map<string, unknown>) {
    if (this.rewardChartRef) {
      this.rewardChartRef.data.datasets[0].data =
        this.episodes.map(getRewardFromEpisode);
      this.rewardChartRef.update();
    }

    if (this.stepsChartRef) {
      this.stepsChartRef.data.datasets[0].data =
        this.episodes.map(getStepsFromEpisode);
      this.stepsChartRef.update();
    }

    super.update(props);
  }

  render(): TemplateResult {
    return html`
      <section class="stats">
        ${this.episodes.length}
        <canvas width="400" height="400" id="reward-chart"></canvas>
        <canvas width="400" height="400" id="steps-chart"></canvas>
      </section>
    `;
  }
}
