import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface ITokenSwapQuote {
  amountIn: FixedDecimal;
  amountOut: FixedDecimal;
}

export class SwapQuoteService {
  /**
   *
   * @param amountIn
   * @param reserveIn
   * @param reserveOut
   * @param transactionFee
   * @returns
   */
  static getAmountOut(
    amountIn: FixedDecimal,
    reserveIn: FixedDecimal,
    reserveOut: FixedDecimal,
    transactionFee: FixedDecimal
  ): ITokenSwapQuote {
    if (amountIn.isZero || reserveIn.isZero || reserveOut.isZero) {
      return {
        amountOut: FixedDecimal.Zero(reserveOut.decimals),
        amountIn
      };
    }

    const amountInTransactionFee = amountIn.multiply(transactionFee);
    const numerator = amountIn.subtract(amountInTransactionFee).multiply(reserveOut);
    const denominator = reserveIn.add(amountIn).add(amountInTransactionFee);
    const amountOut = numerator.divide(denominator);

    return { amountOut, amountIn }
  }

  /**
   *
   * @param amountOut
   * @param reserveIn
   * @param reserveOut
   * @param transactionFee
   * @returns
   */
  static getAmountIn(
    amountOut: FixedDecimal,
    reserveIn: FixedDecimal,
    reserveOut: FixedDecimal,
    transactionFee: FixedDecimal
  ): ITokenSwapQuote {
    if (amountOut.isZero || reserveIn.isZero || reserveOut.isZero) {
      return{
        amountIn: FixedDecimal.Zero(reserveIn.decimals),
        amountOut
      }
    }

    const numerator = reserveIn.multiply(amountOut);
    const percentMinusFee = FixedDecimal.One(3).subtract(transactionFee);
    const denominator = reserveOut.subtract(amountOut).multiply(percentMinusFee);
    const oneSatoshi = amountOut.decimals > 0 ? `0.${'1'.padEnd(amountOut.decimals, '0')}` : '1';
    const amountIn = numerator.divide(denominator).add(new FixedDecimal(oneSatoshi, amountOut.decimals));

    return { amountIn, amountOut }
  }

  /**
   *
   * @param tokenInAmount
   * @param tokenInReserveCrs
   * @param tokenInReserveSrc
   * @param tokenOutReserveCrs
   * @param tokenOutReserveSrc
   * @param transactionFee
   * @returns
   */
  static getAmountOutMulti(
    tokenInAmount: FixedDecimal,
    tokenInReserveCrs: FixedDecimal,
    tokenInReserveSrc: FixedDecimal,
    tokenOutReserveCrs: FixedDecimal,
    tokenOutReserveSrc: FixedDecimal,
    transactionFee: FixedDecimal
  ): ITokenSwapQuote[] {
    const pool0SwapQuote = this.getAmountOut(tokenInAmount, tokenInReserveSrc, tokenInReserveCrs, transactionFee);
    const pool1SwapQuote = this.getAmountOut(pool0SwapQuote.amountOut, tokenOutReserveCrs, tokenOutReserveSrc, transactionFee);

    return [pool0SwapQuote, pool1SwapQuote];
  }

  /**
   *
   * @param tokenOutAmount
   * @param tokenOutReserveCrs
   * @param tokenOutReserveSrc
   * @param tokenInReserveCrs
   * @param tokenInReserveSrc
   * @param transactionFee
   * @returns
   */
  static getAmountInMulti(
    tokenOutAmount: FixedDecimal,
    tokenOutReserveCrs: FixedDecimal,
    tokenOutReserveSrc: FixedDecimal,
    tokenInReserveCrs: FixedDecimal,
    tokenInReserveSrc: FixedDecimal,
    transactionFee: FixedDecimal
  ): ITokenSwapQuote[] {
    const pool0SwapQuote = this.getAmountIn(tokenOutAmount, tokenOutReserveCrs, tokenOutReserveSrc, transactionFee);
    const pool1SwapQuote = this.getAmountIn(pool0SwapQuote.amountOut, tokenInReserveSrc, tokenInReserveCrs, transactionFee);

    return [pool0SwapQuote, pool1SwapQuote];
  }
}
