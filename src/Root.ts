import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  createGameFieldGrid,
  GameFieldElementKind,
  Grid2D,
  normalize2DGrid,
} from './util/grid';
import './Grid';
import { ColorScale } from './colors/ColorScale';
import { RGBColor } from './colors/types';
import GreedyPolicy, { PolicyAction } from './rl/Policy';
import RLGlue from './rl/RLGlue';

const colorScale = new ColorScale(
  { r: 239, g: 243, b: 255 },
  { r: 8, g: 69, b: 147 }
);

const policy = new GreedyPolicy(0.5);

export class Root extends LitElement {
  @property({ type: String })
  title = 'My app';

  @state()
  protected grid!: Grid2D<GameFieldElementKind>;

  @state()
  protected gridColors!: Grid2D<RGBColor>;

  @state()
  protected gridPolicy!: Grid2D<PolicyAction>;

  @state()
  protected width: number = 25;

  @state()
  protected height: number = 25;

  protected rl!: RLGlue;

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: 1rem;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--rl-visual-background-color);
    }

    main {
      flex-grow: 1;
    }

    .controls {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
    }

    .controls__input-wrapper {
      display: flex;
      flex-direction: column;
      justify-items: flex-start;
      margin-bottom: 10px;
    }

    .controls__label {
      text-align: left;
      font-size: 0.9rem;
    }
  `;

  constructor() {
    super();
    this.updateGridDimensions();
  }

  private get widthInput(): HTMLInputElement {
    return this.renderRoot.querySelector('#width-input')!;
  }

  private get heightInput(): HTMLInputElement {
    return this.renderRoot.querySelector('#height-input')!;
  }

  private updateGridDimensions() {
    this.grid = createGameFieldGrid({
      width: this.width,
      height: this.height,
    });
    this.gridColors = [];
    this.gridPolicy = [];
    this.rl = new RLGlue(this.grid, [0, 0], policy);
  }

  private createGridColors(grid: Grid2D<number>) {
    // TODO use data
    return grid.map(row => row.map(val => colorScale.getAt(val)));
  }

  private onDimensionChange(event: Event) {
    event.preventDefault();
    this.width = parseInt(this.widthInput.value, 10);
    this.height = parseInt(this.heightInput.value, 10);

    this.updateGridDimensions();
  }

  private async runRL() {
    const result = await this.rl.runEpisodes(10000);

    // console.log(result);
    const updatedPolicy = this.rl.getOptimalPolicy();

    const visitsGrid = this.rl.getStateVisitsMap();
    const scaledVisitsGrid = normalize2DGrid(visitsGrid);

    console.log(
      'steps',
      result.reduce((acc, cur) => acc + cur.steps, 0) / result.length
    );
    console.log(
      'reward',
      result.reduce((acc, cur) => acc + cur.reward, 0) / result.length
    );

    console.log(updatedPolicy);
    // console.log(updatedPolicy);
    // console.log(scaledAV);
    this.gridPolicy = updatedPolicy;
    this.gridColors = this.createGridColors(scaledVisitsGrid);
  }

  render() {
    return html`
      <main>
        <h1>${this.title}</h1>
        <form
          class="controls"
          @submit=${this.onDimensionChange}
          id="dimensions-form"
        >
          <div class="controls__input-wrapper">
            <label for="width-input" class="controls__label">Width</label>
            <input
              type="number"
              min="0"
              max="100"
              .value="${this.width.toString()}"
              id="width-input"
            />
          </div>
          <div class="controls__input-wrapper">
            <label for="height-input" class="controls__label">Height</label>
            <input
              id="height-input"
              type="number"
              min="0"
              max="100"
              .value="${this.height.toString()}"
            />
          </div>
          <button type="submit">apply</button>
        </form>
        <button @click="${this.runRL}">run RL</button>
        <rl-visual-grid
          .gridPolicy=${this.gridPolicy}
          .gridValues=${this.grid}
          .gridColors=${this.gridColors}
          .width=${this.width}
          .height=${this.height}
        >
        </rl-visual-grid>
      </main>
    `;
  }
}
