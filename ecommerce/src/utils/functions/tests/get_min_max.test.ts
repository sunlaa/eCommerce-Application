import getMinMax from '../get_min_max';

describe('getMinMax function', () => {
  const testData = [
    { arr: [], result: { from: Infinity, to: -Infinity } },
    { arr: [1, 10, -4, -10, 107, 20, 105, 100], result: { from: -10, to: 107 } },
    { arr: [-5, -3, -10, -20, -4, -12], result: { from: -20, to: -3 } },
    { arr: [1, 2], result: { from: 1, to: 2 } },
    { arr: [0], result: { from: 0, to: 0 } },
  ];

  test.each(testData)('should return object $result for array $arr', ({ arr, result }) => {
    const obj = getMinMax(arr);
    expect(obj).toEqual(result);
  });
});
