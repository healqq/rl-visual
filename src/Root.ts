import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  createGameFieldGrid,
  createGrid,
  GameFieldElementKind,
  Grid,
} from './util/grid';
import './Grid';
import { ColorScale, RGBColor } from './colors/color-scale';

const colorScale = new ColorScale(
  { r: 3, g: 65, b: 252 },
  { r: 252, g: 3, b: 252 }
);

export class Root extends LitElement {
  @property({ type: String })
  title = 'My app';

  @state()
  protected grid: Grid<GameFieldElementKind>;

  @state()
  protected gridColors: Grid<RGBColor>;

  @state()
  protected width: number = 10;

  @state()
  protected height: number = 10;

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
    this.grid = this.createGrid();
    this.gridColors = this.createGridColors();
  }

  private createGrid() {
    return createGameFieldGrid({
      width: this.width,
      height: this.height,
    });
  }

  private createGridColors() {
    const grid = createGrid(this.width, this.height, { r: 0, g: 0, b: 0 });
    // TODO use data
    return grid.map(row => row.map(() => colorScale.getAt(Math.random())));
  }

  private onWidthChange(e: InputEvent) {
    if (!e.currentTarget) {
      return;
    }

    this.width = parseInt((e.currentTarget as HTMLInputElement).value, 10);
    this.grid = this.createGrid();
    this.gridColors = this.createGridColors();
  }

  private onHeightChange(e: InputEvent) {
    if (!e.currentTarget) {
      return;
    }

    this.height = parseInt((e.currentTarget as HTMLInputElement).value, 10);
    this.grid = this.createGrid();
    this.gridColors = this.createGridColors();
  }

  render() {
    return html`
      <main>
        <h1>${this.title}</h1>
        <div class="controls">
          <div class="controls__input-wrapper">
            <label for="width-input" class="controls__label">Width</label>
            <input
              type="number"
              min="0"
              max="100"
              .value="${this.width}"
              @change="${this.onWidthChange}"
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
              @change="${this.onHeightChange}"
              .value="${this.height}"
            />
          </div>
        </div>
        <rl-visual-grid
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
