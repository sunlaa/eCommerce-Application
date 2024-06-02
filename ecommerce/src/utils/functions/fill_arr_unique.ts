export default function addUnique<Key>(arr: Key[], value: Key) {
  if (arr.includes(value)) return;
  arr.push(value);
}
