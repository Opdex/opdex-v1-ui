import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';


const MathTestLookup = {
  addTests: [
    { a: new FixedDecimal('0.52400000', 8), b: new FixedDecimal('0.00500000', 8), expectedOutput: '0.52900000'},
    { a: new FixedDecimal('0.52400000', 8), b: new FixedDecimal('1.00500000', 8), expectedOutput: '1.52900000'},
    { a: new FixedDecimal('0.52400000', 8), b: new FixedDecimal('1.105000000000000000', 18), expectedOutput: '1.62900000'},
    { a: new FixedDecimal('0.524000000000000000', 18), b: new FixedDecimal('1.10500000', 8), expectedOutput: '1.629000000000000000'}
  ],
  subtractTests: [
    { a: new FixedDecimal('0.52400000', 8), b: new FixedDecimal('0.00500000', 8), expectedOutput: '0.51900000'},
    { a: new FixedDecimal('0.52400000', 8), b: new FixedDecimal('0.005000000000000000', 18), expectedOutput: '0.51900000'},
    { a: new FixedDecimal('1.524000000000000000', 18), b: new FixedDecimal('0.00500000', 8), expectedOutput: '1.519000000000000000'},
  ],
  multiplyTests: [
    { a: new FixedDecimal('100.12345678', 8), b: new FixedDecimal('2.49', 2), expectedOutput: '249.30740738'},
    { a: new FixedDecimal('84572.87654321', 8), b: new FixedDecimal('1.4123', 4), expectedOutput: '119442.27354197'},
    { a: new FixedDecimal('0.87654321', 8), b: new FixedDecimal('0.4', 1), expectedOutput: '0.35061728'},
    { a: new FixedDecimal('0.00', 2), b: new FixedDecimal('0', 0), expectedOutput: '0.00'},
    { a: new FixedDecimal('0.00', 2), b: new FixedDecimal('1.112', 3), expectedOutput: '0.00'},
    { a: new FixedDecimal('1.523', 3), b: new FixedDecimal('0.000', 3), expectedOutput: '0.000'},
    { a: new FixedDecimal('0.524', 3), b: new FixedDecimal('0.005', 3), expectedOutput: '0.002'},
    { a: new FixedDecimal('0.52400000', 8), b: new FixedDecimal('0.005', 3), expectedOutput: '0.00262000'},
    { a: new FixedDecimal('0.1', 8), b: new FixedDecimal('0.00112', 8), expectedOutput: '0.00011200'},
    { a: new FixedDecimal('0.000821718157178238', 18), b: new FixedDecimal('0.00112', 8), expectedOutput: '0.000000920324336039'},
  ],
  divideTests: [
    { a: new FixedDecimal('20.00000000', 8), b: new FixedDecimal('5.00000000', 8), expectedOutput: '4.00000000'},
    { a: new FixedDecimal('20.40000000', 8), b: new FixedDecimal('.50000000', 8), expectedOutput: '40.80000000'},
    { a: new FixedDecimal('1.20000000', 8), b: new FixedDecimal('.33300000', 8), expectedOutput: '3.60360360'},
    { a: new FixedDecimal('1.00000000', 8), b: new FixedDecimal('10.00000000', 8), expectedOutput: '0.10000000'},
    { a: new FixedDecimal('1.00000000', 8), b: new FixedDecimal('10.000000000000000000', 18), expectedOutput: '0.10000000'},
    { a: new FixedDecimal('1.000000000000000000', 18), b: new FixedDecimal('10.00000000', 8), expectedOutput: '0.100000000000000000'},
  ],
}

describe('MathService', () => {
  MathTestLookup.addTests.forEach(test => {
    it(`adds ${test.a.originalValue} and ${test.b.originalValue}`, () => {
      expect(MathService.add(test.a, test.b).formattedValue).toBe(test.expectedOutput);
    });
  });

  MathTestLookup.subtractTests.forEach(test => {
    it(`subtracts ${test.a.originalValue} minus ${test.b.originalValue}`, () => {
      expect(MathService.subtract(test.a, test.b).formattedValue).toBe(test.expectedOutput);
    });
  });

  MathTestLookup.multiplyTests.forEach(test => {
    it(`multiplies ${test.a.originalValue} times ${test.b.originalValue}`, () => {
      expect(MathService.multiply(test.a, test.b).formattedValue).toBe(test.expectedOutput);
    });
  });

  MathTestLookup.divideTests.forEach(test => {
    it(`divides ${test.a.originalValue} by ${test.b.originalValue}`, () => {
      expect(MathService.divide(test.a, test.b).formattedValue).toBe(test.expectedOutput);
    });
  });
});
