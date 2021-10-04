import { ShortNumberPipe } from 'src/app/pipes/short-number.pipe';

class ShortNumberTest {
  input: string | number;
  expectedOutput: string;
}

const ShortNumberTestLookup = {
  nanTests: [
    'abc',
    'abc123',
    'abc,$123',
    '12,311,174,123',
    '12311,174,123',
    '.00',
    '.00.1',
    .00,
    .0
  ],
  decimalTests: [
    {input: '0.0', expectedOutput: '0'},
    {input: 0.0, expectedOutput: '0'},
    {input: '1.1', expectedOutput: '1.10'},
    {input: '.012', expectedOutput: '0.0120'},
    {input: '.0125635', expectedOutput: '0.0126'},
    {input: '0.00001234', expectedOutput: '<0.0001'},
    {input: '0.000046342542345', expectedOutput: '<0.0001'},
    {input: '0.00046342542345', expectedOutput: '0.0005'},
    {input: '0.23446342542345', expectedOutput: '0.2345'}
  ],
  smallNumTests: [
    {input: '0', expectedOutput: '0'},
    {input: '00', expectedOutput: '0'},
    {input: '000', expectedOutput: '0'},
    {input: '1', expectedOutput: '1'},
    {input: 1, expectedOutput: '1'},
    {input: 0, expectedOutput: '0'},
    {input: '999', expectedOutput: '999'},
    {input: '99', expectedOutput: '99'},
    {input: '9', expectedOutput: '9'},
    {input: 999, expectedOutput: '999'},
    {input: 99, expectedOutput: '99'},
    {input: 9, expectedOutput: '9'}
  ],
  thousandsTests: [
    {input: '174123.1234', expectedOutput: '174.12k'},
    {input: '17123.99', expectedOutput: '17.12k'},
    {input: '1123.1234', expectedOutput: '1.12k'},
    {input: '174123', expectedOutput: '174.12k'}
  ],
  millionsTests: [
    {input: '111174123.1234', expectedOutput: '111.17M'},
    {input: '11174123.1234', expectedOutput: '11.17M'},
    {input: '1174123.1234', expectedOutput: '1.17M'},
    {input: '11174123', expectedOutput: '11.17M'}
  ],
  billionsTests: [
    {input: '112311174123.1234', expectedOutput: '112.31B'},
    {input: '12311174123.1234', expectedOutput: '12.31B'},
    {input: '1311174123.1234', expectedOutput: '1.31B'},
    {input: '12311174123', expectedOutput: '12.31B'}
  ],
  trillionsTests: [
    {input: '512336411174123.1234', expectedOutput: '512.34T'},
    {input: '12336411174123.1234', expectedOutput: '12.34T'},
    {input: '2336411174123.1234', expectedOutput: '2.34T'},
    {input: '12336411174123', expectedOutput: '12.34T'}
  ]
}

describe('ShortNumberPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new ShortNumberPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  ShortNumberTestLookup.nanTests.forEach(input => {
    it(`transforms NAN ${input} to "NAN"`, () => {
      expect(pipe.transform(input)).toBeNaN;
    });
  });

  ShortNumberTestLookup.decimalTests.forEach((test: ShortNumberTest) => {
    it(`transforms decimal ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  ShortNumberTestLookup.smallNumTests.forEach((test: ShortNumberTest) => {
    it(`transforms small number ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  ShortNumberTestLookup.thousandsTests.forEach((test: ShortNumberTest) => {
    it(`transforms thousands ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  ShortNumberTestLookup.millionsTests.forEach((test: ShortNumberTest) => {
    it(`transforms millions ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  ShortNumberTestLookup.billionsTests.forEach((test: ShortNumberTest) => {
    it(`transforms billions ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  ShortNumberTestLookup.trillionsTests.forEach((test: ShortNumberTest) => {
    it(`transforms trillions ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });
});
