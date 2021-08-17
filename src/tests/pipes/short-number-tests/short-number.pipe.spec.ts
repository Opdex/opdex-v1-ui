import { ShortNumberPipe } from 'src/app/pipes/short-number.pipe';
import { PipesTestLookup, ShortNumberTest } from './pipe.test.lookup';


describe('ShortNumberPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new ShortNumberPipe();
  const shortNumTestValues = PipesTestLookup.shortNumber;

  it('create an instance', () => {
    const pipe = new ShortNumberPipe();
    expect(pipe).toBeTruthy();
  });

  shortNumTestValues.nanTests.forEach(input => {
    it(`transforms ${input} to "NAN"`, () => {
      expect(pipe.transform(input)).toBeNaN;
    });
  });

  shortNumTestValues.decimalTests.forEach((test: ShortNumberTest) => {
    it(`transforms ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  shortNumTestValues.smallNumTests.forEach((test: ShortNumberTest) => {
    it(`transforms ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  shortNumTestValues.thousandsTests.forEach((test: ShortNumberTest) => {
    it(`transforms ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  shortNumTestValues.millionsTests.forEach((test: ShortNumberTest) => {
    it(`transforms ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  shortNumTestValues.billionsTests.forEach((test: ShortNumberTest) => {
    it(`transforms ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });

  shortNumTestValues.trillionsTests.forEach((test: ShortNumberTest) => {
    it(`transforms ${test.input} to ${test.expectedOutput}`, () => {
      expect(pipe.transform(test.input)).toBe(test.expectedOutput);
    });
  });
});
