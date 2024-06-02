export default function getMinMax(arr: number[]) {
  let from = Infinity;
  let to = -Infinity;

  arr.forEach((num) => {
    from = Math.min(num, from);
    to = Math.max(num, to);
  });

  return { from, to };
}
