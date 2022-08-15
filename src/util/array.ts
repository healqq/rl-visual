export const maxAtIndex = (array: number[]): number => {
  let maxIndex = 0;
  let max = array[0];
  for (let i = 1; i < array.length; i += 1) {
    if (array[i] > max) {
      max = array[i];
      maxIndex = i;
    }
  }

  return maxIndex;
};

export const movingAverage = (
  array: number[],
  windowSize: number
): number[] => {
  let i = 0;
  let index = 0;
  let chunk = array.slice(i, i + windowSize);
  const result = new Array(array.length / windowSize);

  while (chunk.length) {
    result[i] = chunk.reduce((acc, cur) => acc + cur, 0) / windowSize;
    i += 1;
    index += windowSize;
    chunk = array.slice(index, index + windowSize);
  }

  return result;
};
