export function findMedianQuickSelect(arr: number[]): number {
  const n = arr.length;
  if (n % 2 === 1) {
    return quickSelect(arr, 0, n - 1, Math.floor(n / 2));
  } else {
    const left = quickSelect(arr, 0, n - 1, n / 2 - 1);
    const right = quickSelect(arr, 0, n - 1, n / 2);
    return (left + right) / 2;
  }
}

function quickSelect(
  arr: number[],
  left: number,
  right: number,
  k: number,
): number {
  if (left === right) return arr[left];

  const pivotIndex = partition(arr, left, right);

  if (k === pivotIndex) return arr[k];
  else if (k < pivotIndex) return quickSelect(arr, left, pivotIndex - 1, k);
  else return quickSelect(arr, pivotIndex + 1, right, k);
}

function partition(arr: number[], left: number, right: number): number {
  const pivot = arr[right];

  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[right]] = [arr[right], arr[i]];

  return i;
}
