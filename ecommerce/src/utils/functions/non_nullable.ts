export default function nonNullable<T>(value: T): value is NonNullable<T> {
  if (value !== null && value !== undefined) {
    return true;
  }
  return false;
}
