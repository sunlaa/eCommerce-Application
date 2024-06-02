export default function fixPrice(centAmount: number, fracionDigit: number) {
  const multiplier = Math.pow(10, fracionDigit);
  return centAmount / multiplier;
}
