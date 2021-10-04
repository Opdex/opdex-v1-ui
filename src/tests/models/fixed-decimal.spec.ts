import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

describe('FixedDecimal', () => {
  it('creates an instance', () => {
    var fixedDecimal = new FixedDecimal('10', 2)
    expect(fixedDecimal).toBeTruthy();
  });

  it(`sets original value`, () => {
    var fixedDecimal = new FixedDecimal('10', 2)
    expect(fixedDecimal.originalValue).toBe('10');
  });

  it(`sets decimals`, () => {
    var fixedDecimal = new FixedDecimal('10', 2)
    expect(fixedDecimal.decimals).toBe(2);
  });

  it(`sets whole number`, () => {
    var fixedDecimal = new FixedDecimal('10', 2)
    expect(fixedDecimal.wholeNumber).toBe('10');
  });

  it(`sets fraction number`, () => {
    var fixedDecimal = new FixedDecimal('10', 2)
    expect(fixedDecimal.fractionNumber).toBe('00');
  });

  it(`gets bigint number`, () => {
    var fixedDecimal = new FixedDecimal('10', 2)
    var expected = BigInt('1000');
    expect(fixedDecimal.bigInt).toBe(expected);
  });

  it(`gets isZero true`, () => {
    var fixedDecimal = new FixedDecimal('0', 0)
    expect(fixedDecimal.isZero).toBe(true);
  });

  it(`gets isZero false`, () => {
    var fixedDecimal = new FixedDecimal('10', 2)
    expect(fixedDecimal.isZero).toBe(false);
  });
});
