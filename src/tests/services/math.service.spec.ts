import { MathService } from '@sharedServices/utility/math.service';

describe('MathService', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  let service: MathService;
  beforeEach(() => { service = new MathService(); });

  it('creates an instance', () => {
    expect(service).toBeTruthy();
  });

  it(`multiplies 100.12345678 * 2.49`, () => {
    expect(service.multiply('100.12345678', 2.49)).toBe('249.30740738');
  });

  it(`multiplies 84572.87654321 * 1.4123`, () => {
    expect(service.multiply('84572.87654321', 1.4123)).toBe('119442.27354197');
  });

  it(`multiplies 0.87654321 * 0.4`, () => {
    expect(service.multiply('0.87654321', 0.4)).toBe('0.35061728');
  });

  it(`multiplies 0.00 * 0`, () => {
    expect(service.multiply('0.00', 0)).toBe('0');
  });

  it(`multiplies 0.00 * 1.112`, () => {
    expect(service.multiply('0.00', 1.112)).toBe('0');
  });

  it(`multiplies 1.523 * 0`, () => {
    expect(service.multiply('1.523', 0)).toBe('0');
  });
});
