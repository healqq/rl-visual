export enum GameFieldElementKind {
  EMPTY,
  START,
  FINISH,
  BOMB,
}

export type Grid<T> = Array<Array<T>>;

const getRandomIndex = (size: number): number =>
  Math.floor(Math.random() * size);

const getRandom2DCoordinate = (
  width: number,
  height: number
): [number, number] => [getRandomIndex(height), getRandomIndex(width)];

export const createGrid = <T>(
  width: number,
  height: number,
  initialValue: T
): Grid<T> => {
  const grid = [];
  for (let i = 0; i < height; i += 1) {
    grid.push(new Array(width).fill(initialValue));
  }

  return grid;
};

export const createGameFieldGrid = ({
  width,
  height,
  bombsCount = 5,
}: {
  width: number;
  height: number;
  bombsCount?: number;
}): Grid<GameFieldElementKind> => {
  const grid = createGrid<GameFieldElementKind>(
    width,
    height,
    GameFieldElementKind.EMPTY
  );

  /* TODO: make sure that overlaps are not possible */
  const [startElementX, startElementY] = getRandom2DCoordinate(width, height);
  const [endElementX, endElementY] = getRandom2DCoordinate(width, height);

  const bombs = [...Array.from({ length: bombsCount })].map(() =>
    getRandom2DCoordinate(width, height)
  );

  bombs.forEach(([x, y]) => {
    grid[x][y] = GameFieldElementKind.BOMB;
  });

  grid[startElementX][startElementY] = GameFieldElementKind.START;
  grid[endElementX][endElementY] = GameFieldElementKind.FINISH;

  return grid;
};
