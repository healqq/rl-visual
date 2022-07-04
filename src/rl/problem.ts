import { GameFieldElementKind } from '../util/grid';

export const rewardMap: Record<GameFieldElementKind, Number> = {
  [GameFieldElementKind.EMPTY]: -1,
  [GameFieldElementKind.BOMB]: -100,
  [GameFieldElementKind.START]: -1,
  [GameFieldElementKind.FINISH]: 0,
};
