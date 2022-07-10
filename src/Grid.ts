import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { RGBColor } from './colors/types';
import { RGBColorToString } from './colors/util';
import { PolicyAction } from './rl/Policy';
import { GameFieldElementKind, Grid2D } from './util/grid';

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
  protected width: number = 5;

  @property({ type: Number })
  protected height: number = 5;

  @property({ attribute: false })
  protected gridValues: Grid2D<GameFieldElementKind> = [];

  @property({ attribute: false })
  protected gridColors: Grid2D<RGBColor> = [];

  @property({ attribute: false })
  protected gridPolicy: Grid2D<PolicyAction> = [];

  static styles = css`
    .grid {
      --grid-cell-size: 30px;

      display: grid;
      gap: 1px;
      background: #ccc;
      grid-auto-flow: column;
    }

    .grid__cell {
      background: #fff;
      position: relative;
    }

    .grid__cell:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }

    .grid__cell--overlay-0:before {
      content: '🡡';
    }

    .grid__cell--overlay-1:before {
      content: '🡢';
    }

    .grid__cell--overlay-2:before {
      content: '🡣';
    }

    .grid__cell--overlay-3:before {
      content: '🡠';
    }
  `;

  render(): TemplateResult {
    return html`
      <section
        class="grid"
        style=${styleMap({
          gridTemplateColumns: `repeat(${this.width}, 1fr)`,
          gridTemplateRows: `repeat(${this.height}, 1fr)`,
        })}
      >
        ${this.gridValues.flatMap((row, x) =>
          row.map(
            (cell, y) => html`
              <div
                class=${[
                  'grid__cell',
                  !!this.gridPolicy.length &&
                    `grid__cell--overlay-${this.gridPolicy[x][y]}`,
                ].join(' ')}
                style=${this.gridColors.length
                  ? styleMap({
                      backgroundColor: RGBColorToString(this.gridColors[x][y]),
                    })
                  : {}}
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
