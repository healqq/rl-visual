import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { RGBColor, RGBColorToString } from './colors/color-scale';
import { GameFieldElementKind, Grid as GridType } from './util/grid';

const gameFieldElementKindMap: Record<GameFieldElementKind, string> = {
  [GameFieldElementKind.EMPTY]: '',
  [GameFieldElementKind.BOMB]: '💣',
  [GameFieldElementKind.FINISH]: '🏴',
  [GameFieldElementKind.START]: '🏎️',
};

@customElement('rl-visual-grid')
export class Grid extends LitElement {
  @property({ type: String })
  title = 'My app';

  @property({ type: Number })
  protected width: number = 10;

  @property({ type: Number })
  protected height: number = 10;

  @property({ attribute: false })
  protected gridValues: GridType<GameFieldElementKind> = [];

  @property({ attribute: false })
  protected gridColors: GridType<RGBColor> = [];

  static styles = css`
    .grid {
      --grid-cell-size: 30px;

      display: grid;
      gap: 1px;
      background: #ccc;
    }

    .grid__cell {
      background: #fff;
    }
  `;

  render() {
    return html`
      <section
        class="grid"
        style=${styleMap({
          gridTemplateColumns: `repeat(${this.width}, 1fr)`,
          gridTemplateRows: `repeat(${this.height}, 1fr)`,
        })}
      >
        ${this.gridValues.flatMap((row, rowIndex) =>
          row.map(
            (cell, columnIndex) => html`
              <div
                class="grid__cell"
                style=${styleMap({
                  backgroundColor: RGBColorToString(
                    this.gridColors[rowIndex][columnIndex]
                  ),
                })}
              >
                ${gameFieldElementKindMap[cell]}
              </div>
            `
          )
        )}
      </section>
    `;
  }
}
