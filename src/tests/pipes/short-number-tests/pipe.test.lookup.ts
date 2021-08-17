export class ShortNumberTest {
  input: string | number;
  expectedOutput: string;
}

export const PipesTestLookup = {
  shortNumber: {
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
}
