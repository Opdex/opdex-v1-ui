import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

class FixedDecimalTest {
  input: string | number;
  expectedOutput: string;
}

const FixedDecimalSuccessfulTestsLookup = [
  { input: '1.00', formattedValue: '1.00', decimals: 2, whole: '1', fraction: '00', bigInt: BigInt('100'), isZero: false },
  { input: '0', formattedValue: '0.00000000',decimals: 8, whole: '0', fraction: '00000000', bigInt: BigInt('0'), isZero: true },
  { input: '0.0000', formattedValue: '0.0000',decimals: 4, whole: '0', fraction: '0000', bigInt: BigInt('0'), isZero: true },
  { input: '-.001', formattedValue: '-0.00100000',decimals: 8, whole: '-0', fraction: '00100000', bigInt: BigInt('-100000'), isZero: false },
  { input: '-1.001', formattedValue: '-1.00100000',decimals: 8, whole: '-1', fraction: '00100000', bigInt: BigInt('-100100000'), isZero: false },
  { input: '23.000012345678912348', formattedValue: '23.000012345678912348',decimals: 18, whole: '23', fraction: '000012345678912348', bigInt: BigInt('23000012345678912348'), isZero: false },
  { input: '23.00001234567891234', formattedValue: '23.00',decimals: 2, whole: '23', fraction: '00', bigInt: BigInt('2300'), isZero: false },
  { input: '12', formattedValue: '12.00000000',decimals: 8, whole: '12', fraction: '00000000', bigInt: BigInt('1200000000'), isZero: false },
  { input: '12', formattedValue: '12',decimals: 0, whole: '12', fraction: '', bigInt: BigInt('12'), isZero: false },
];

const FixedDecimalResizeTestsLookup = [
  { input: new FixedDecimal('1.12345678', 8), resize: 18, expected: new FixedDecimal('1.123456780000000000', 18)},
  { input: new FixedDecimal('1.123456780000000000', 18), resize: 8, expected: new FixedDecimal('1.12345678', 8)},
  { input: new FixedDecimal('1.123456780000000000', 18), resize: 0, expected: new FixedDecimal('1', 0)}
]

describe('FixedDecimal', () => {
  FixedDecimalSuccessfulTestsLookup.forEach((test: any) => {
    it(`Creates ${test.input} FixedDecimal with ${test.decimals} decimals as ${test.formattedValue}`, () => {
      const value = new FixedDecimal(test.input, test.decimals);

      expect(value).toBeTruthy();
      expect(value.originalValue).toBe(test.input);
      expect(value.formattedValue).toBe(test.formattedValue);
      expect(value.decimals).toBe(test.decimals);
      expect(value.wholeNumber).toBe(test.whole);
      expect(value.fractionNumber).toBe(test.fraction);
      expect(value.bigInt).toBe(test.bigInt);
      expect(value.isZero).toBe(test.isZero);
    });
  });

  FixedDecimalResizeTestsLookup.forEach((test: any) => {
    it(`Resizes ${test.input.formattedValue} with ${test.resize} decimals as ${test.expected.formattedValue}`, () => {
      test.input.resize(test.resize);

      expect(test.expected).toBeTruthy();
      expect(test.input.formattedValue).toBe(test.expected.formattedValue);
      expect(test.input.decimals).toBe(test.expected.decimals);
      expect(test.input.wholeNumber).toBe(test.expected.wholeNumber);
      expect(test.input.fractionNumber).toBe(test.expected.fractionNumber);
    });
  });
});
