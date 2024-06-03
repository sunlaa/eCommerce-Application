export default function isArraysEqual<Value>(arr1: Value[], arr2: Value[]) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((element, index) => element === arr2[index]);
}
