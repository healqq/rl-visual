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
