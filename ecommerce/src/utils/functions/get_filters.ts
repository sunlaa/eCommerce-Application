export function getAttributeFilter(name: string, values: string[]) {
  const func = (string: string) => `"${string}", `;
  let result = `variants.attributes.${name}:`;
  values.forEach((key) => {
    result += `${func(key)}`;
  });
  return result.trim().slice(0, -1);
}
