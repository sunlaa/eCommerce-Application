import fixPrice from '../fix_price';

describe('getMinMax function', () => {
  const testData = [
    { data: { centAmount: 1234, fracionDigit: 3 }, result: 1.234 },
    { data: { centAmount: 0, fracionDigit: 3 }, result: 0 },
    { data: { centAmount: 123.34, fracionDigit: 3 }, result: 0.12334 },
    { data: { centAmount: 45678, fracionDigit: 1 }, result: 4567.8 },
  ];

  test.each(testData)('should return object $result for array $arr', ({ data, result }) => {
    const fixPriced = fixPrice(data.centAmount, data.fracionDigit);
    expect(fixPriced).toEqual(result);
  });
});
