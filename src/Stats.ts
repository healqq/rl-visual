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
import { movingAverage } from './util/array';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  LogarithmicScale,
  Title
);

const MA_WINDOW_SIZE = 50;

const getChartConfig = ({
  label,
  color,
}: {
  label: string;
  color: string;
}): ChartConfiguration => ({
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
    plugins: {
      title: {
        display: true,
        text: label,
        font: {
          size: 14 * 1.5,
          weight: 'bold',
        },
      },
    },
  },
  data: {
    datasets: [
      {
        data: [],
        borderColor: color,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  },
});

const getRewardFromEpisode = (episode: EpisodeRecord) => -episode.reward;

const getStepsFromEpisode = (episode: EpisodeRecord) => episode.steps;

const mapToDataset = (item: number, index: number) => ({
  x: index * MA_WINDOW_SIZE,
  y: item,
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
      background: #fff;
      gap: 12px;
      grid-template-columns: 1fr;
      grid-template-rows: max-content;
      grid-auto-rows: 1fr;
      padding: 12px;
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
      getChartConfig({ label: 'Reward', color: '#1D3557' })
    );
    this.stepsChartRef = new Chart(
      ctxSteps as HTMLCanvasElement,
      getChartConfig({ label: 'Steps', color: '#E63946' })
    );
  }

  update(props: Map<string, unknown>) {
    if (this.rewardChartRef) {
      this.rewardChartRef.data.datasets[0].data = movingAverage(
        this.episodes.map(getRewardFromEpisode),
        MA_WINDOW_SIZE
      ).map(mapToDataset);
      this.rewardChartRef.update();
    }

    if (this.stepsChartRef) {
      this.stepsChartRef.data.datasets[0].data = movingAverage(
        this.episodes.map(getStepsFromEpisode),
        MA_WINDOW_SIZE
      ).map(mapToDataset);
      this.stepsChartRef.update();
    }

    super.update(props);
  }

  render(): TemplateResult {
    return html`
      <section class="stats">
        <canvas width="400" height="400" id="reward-chart"></canvas>
        <canvas width="400" height="400" id="steps-chart"></canvas>
      </section>
    `;
  }
}
