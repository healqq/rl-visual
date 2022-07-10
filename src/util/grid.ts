export enum GameFieldElementKind {
  EMPTY,
  START,
  FINISH,
  BOMB,
}

export type Grid2D<T> = Array<Array<T>>;

export type Grid3D<T> = Array<Array<Array<T>>>;

export type Coordinate2D = [number, number];

const getRandomIndex = (size: number): number =>
  Math.floor(Math.random() * size);

const getRandom2DCoordinate = (width: number, height: number): Coordinate2D => [
  getRandomIndex(height),
  getRandomIndex(width),
];

export const create2DGrid = <T>(
  {
    x,
    y,
  }: {
    x: number;
    y: number;
  },
  initialValue: T
): Grid2D<T> => {
  const grid = [];
  for (let i = 0; i < x; i += 1) {
    grid.push(new Array(y).fill(initialValue));
  }

  return grid;
};

export const normalize2DGrid = (grid: Grid2D<number>): Grid2D<number> => {
  const flatArray = grid.flatMap(row => row);
  const max = Math.max(...flatArray);
  const min = Math.min(...flatArray);
  const range = max - min;

  return grid.map(col => col.map(val => (val - min) / range));
};

export const create3DGrid = <T>(
  {
    x,
    y,
    z,
  }: {
    x: number;
    y: number;
    z: number;
  },
  initialValue: T
): Grid3D<T> => {
  const grid = [];
  for (let i = 0; i < x; i += 1) {
    const col = [];
    for (let j = 0; j < y; j += 1) {
      col.push(new Array(z).fill(initialValue));
    }

    grid.push(col);
  }

  return grid;
};

export const createGameFieldGrid = ({
  width,
  height,
}: {
  width: number;
  height: number;
}): Grid2D<GameFieldElementKind> => {
  const grid = create2DGrid<GameFieldElementKind>(
    {
      x: width,
      y: height,
    },
    GameFieldElementKind.EMPTY
  );

  /* TODO: make sure that overlaps are not possible */
  const [startElementX, startElementY] = [0, 0];
  const [endElementX, endElementY] = getRandom2DCoordinate(width, height);
  const bombsCount = Math.floor(Math.sqrt(width * height));

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

/* 
  TODO: number should be replaced with "primitive" 
  but we only use numbers for now
*/
type ArrayLike<T> = Array<ArrayLike<T>> | Array<T>;

export const shape = <T>(arrayLike: ArrayLike<T>): number[] => {
  const [el] = arrayLike;
  if (Array.isArray(el)) {
    return [arrayLike.length, ...shape(el)];
  }

  return [arrayLike.length];
};
