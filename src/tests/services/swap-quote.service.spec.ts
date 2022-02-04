import { SwapQuoteService } from '@sharedServices/utility/swap-quote.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

const SwapQuoteTestsLookup = {
  getAmountInTests: [
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('251', 0),
      transactionFee: new FixedDecimal('.000', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('251', 0),
      transactionFee: new FixedDecimal('.001', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('251', 0),
      transactionFee: new FixedDecimal('.002', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('251', 0),
      transactionFee: new FixedDecimal('.003', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('252', 0),
      transactionFee: new FixedDecimal('.004', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('252', 0),
      transactionFee: new FixedDecimal('.005', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('252', 0),
      transactionFee: new FixedDecimal('.006', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('252', 0),
      transactionFee: new FixedDecimal('.007', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('253', 0),
      transactionFee: new FixedDecimal('.008', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('253', 0),
      transactionFee: new FixedDecimal('.009', 3)
    },
    {
      amountOut: new FixedDecimal('2000', 0),
      reserveIn: new FixedDecimal('1000', 0),
      reserveOut: new FixedDecimal('10000', 0),
      expected: new FixedDecimal('253', 0),
      transactionFee: new FixedDecimal('.01', 3)
    },
  ],
  getAmountOutTests: [
    {
      amountIn: new FixedDecimal('100', 8),
      reserveIn: new FixedDecimal('1000', 8),
      reserveOut: new FixedDecimal('10000', 8),
      expected: new FixedDecimal('909.09090909', 8),
      transactionFee: new FixedDecimal('.000', 3)
    },
    {
      amountIn: new FixedDecimal('100', 8),
      reserveIn: new FixedDecimal('1000', 8),
      reserveOut: new FixedDecimal('10000', 8),
      expected: new FixedDecimal('908.09926370', 8),
      transactionFee: new FixedDecimal('.001', 3)
    },
    {
      amountIn: new FixedDecimal('100', 8),
      reserveIn: new FixedDecimal('1000', 8),
      reserveOut: new FixedDecimal('10000', 8),
      expected: new FixedDecimal('907.10779858', 8),
      transactionFee: new FixedDecimal('.002', 3)
    },
    {
      amountIn: new FixedDecimal('100', 8),
      reserveIn: new FixedDecimal('1000', 8),
      reserveOut: new FixedDecimal('10000', 8),
      expected: new FixedDecimal('906.11651367', 8),
      transactionFee: new FixedDecimal('.003', 3)
    },
    // {
    //   amountIn: new FixedDecimal('100', 8),
    //   reserveIn: new FixedDecimal('1000', 8),
    //   reserveOut: new FixedDecimal('10000', 8),
    //   expected: new FixedDecimal('905.12540894', 8),
    //   transactionFee: new FixedDecimal('.004', 3)
    // },
    // {
    //   amountIn: new FixedDecimal('100', 8),
    //   reserveIn: new FixedDecimal('1000', 8),
    //   reserveOut: new FixedDecimal('10000', 8),
    //   expected: new FixedDecimal('904', 8),
    //   transactionFee: new FixedDecimal('.005', 3)
    // },
    // {
    //   amountIn: new FixedDecimal('100', 8),
    //   reserveIn: new FixedDecimal('1000', 8),
    //   reserveOut: new FixedDecimal('10000', 8),
    //   expected: new FixedDecimal('904', 8),
    //   transactionFee: new FixedDecimal('.006', 3)
    // },
    // {
    //   amountIn: new FixedDecimal('100', 8),
    //   reserveIn: new FixedDecimal('1000', 8),
    //   reserveOut: new FixedDecimal('10000', 8),
    //   expected: new FixedDecimal('903', 8),
    //   transactionFee: new FixedDecimal('.007', 3)
    // },
    // {
    //   amountIn: new FixedDecimal('100', 8),
    //   reserveIn: new FixedDecimal('1000', 8),
    //   reserveOut: new FixedDecimal('10000', 8),
    //   expected: new FixedDecimal('902', 8),
    //   transactionFee: new FixedDecimal('.008', 3)
    // },
    // {
    //   amountIn: new FixedDecimal('100', 8),
    //   reserveIn: new FixedDecimal('1000', 8),
    //   reserveOut: new FixedDecimal('10000', 8),
    //   expected: new FixedDecimal('901', 8),
    //   transactionFee: new FixedDecimal('.009', 3)
    // },
    // {
    //   amountIn: new FixedDecimal('100', 8),
    //   reserveIn: new FixedDecimal('1000', 8),
    //   reserveOut: new FixedDecimal('10000', 8),
    //   expected: new FixedDecimal('900', 8),
    //   transactionFee: new FixedDecimal('.01', 3)
    // }
  ],
}

describe('SwapQuoteService', () => {
  SwapQuoteTestsLookup.getAmountOutTests.forEach(test => {
    it(`gets amount out from ${test.amountIn.formattedValue} expecting ${test.expected.formattedValue}`, () => {
      const quoteResult = SwapQuoteService.getAmountOut(test.amountIn, test.reserveIn, test.reserveOut, test.transactionFee);
      expect(quoteResult.amountOut.formattedValue).toBe(test.expected.formattedValue);
    });
  });

  SwapQuoteTestsLookup.getAmountInTests.forEach(test => {
    it(`gets amount in from ${test.amountOut.formattedValue} expecting ${test.expected.formattedValue}`, () => {
      const quoteResult = SwapQuoteService.getAmountIn(test.amountOut, test.reserveIn, test.reserveOut, test.transactionFee);
      expect(quoteResult.amountIn.formattedValue).toBe(test.expected.formattedValue);
    });
  });
});
