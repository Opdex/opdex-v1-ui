import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface ITokenSwapQuote {
  amountIn: FixedDecimal;
  amountOut: FixedDecimal;
}

export class SwapQuoteService {
  /**
   * Quote the amount of output tokens for a CRS and SRC swap transaction
   * @param amountIn The amount of tokens being input
   * @param reserveIn The pool reserves of the input token
   * @param reserveOut The pool reserves of the output token
   * @param transactionFee The market's swap transaction fee
   * @returns Token swap quote of final amount in and amount out
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
   * Quote the amount of input tokens for a CRS and SRC swap transaction
   * @param amountOut The amount of tokens being output
   * @param reserveIn The pool reserves of thh input token
   * @param reserveOut The pool reserves of the output token
   * @param transactionFee The market's swap transaction fee
   * @returns Token swap quote of final amount in and amount out
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
    const oneSat = amountOut.decimals > 0 ? `0.${'1'.padEnd(amountOut.decimals, '0')}` : '1';
    const amountIn = numerator.divide(denominator).add(new FixedDecimal(oneSat, amountOut.decimals));

    return { amountIn, amountOut }
  }

  /**
   * Quote the amount of output tokens for an SRC to SRC token swap transaction.
   * @param tokenInAmount The amount of tokens being input
   * @param tokenInReserveCrs The input token's liquidity pool CRS reserves
   * @param tokenInReserveSrc The input token's liquidity pool SRC reserves
   * @param tokenOutReserveCrs The output token's liquidity pool CRS reserves
   * @param tokenOutReserveSrc The output token's liquidity pool SRC reserves
   * @param transactionFee The market's swap transaction fee
   * @returns Token swap quote of final amount in and amount out for each hop in the transaction
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
   * Quote the required amount of input tokens for an SRC to SRC token swap transaction.
   * @param tokenOutAmount The amount of tokens being output
   * @param tokenOutReserveCrs The output token's liquidity pool CRS reserves
   * @param tokenOutReserveSrc The output token's liquidity pool SRC reserves
   * @param tokenInReserveCrs The input token's liquidity pool CRS reserves
   * @param tokenInReserveSrc The input token's liquidity pool SRC reserves
   * @param transactionFee The market's swap transaction fee
   * @returns Token swap quote of final amount in and amount out for each hop in the transaction
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

  /**
   * Quote the price impact of a swap transaction
   * @param tokenInAmount The amount of input tokens
   * @param tokenOutAmount The amount of output tokens
   * @param tokenIn The input token
   * @param tokenOut The output token
   * @param poolIn The input token's liquidity pool
   * @param poolOut The output token's liquidity pool
   * @param transactionFee The market's swap transaction fee
   * @returns Percentage based price impact of a swap transaction
   */
  static getPriceImpact(
    tokenInAmount: FixedDecimal,
    tokenIn: IToken,
    tokenOut: IToken,
    poolIn: ILiquidityPoolResponse,
    poolOut: ILiquidityPoolResponse,
    transactionFee: FixedDecimal
  ): number {
    const isSrcToSrc = tokenIn.address !== 'CRS' && tokenOut.address !== 'CRS';
    const isCrsToSrc = !isSrcToSrc && tokenIn.address === 'CRS';
    const pool0CrsReserves = new FixedDecimal(poolIn.summary.reserves.crs, poolIn.tokens.crs.decimals);
    const pool0SrcReserves = new FixedDecimal(poolIn.summary.reserves.src, poolIn.tokens.src.decimals);
    const pool1CrsReserves = new FixedDecimal(poolOut.summary.reserves.crs, poolOut.tokens.crs.decimals);
    const pool1SrcReserves = new FixedDecimal(poolOut.summary.reserves.src, poolOut.tokens.src.decimals);

    let currentMidPrice: FixedDecimal;
    let updatedMidPrice : FixedDecimal;

    if (isSrcToSrc) {
      const quote = this.getAmountOutMulti(tokenInAmount, pool0CrsReserves, pool0SrcReserves, pool1CrsReserves, pool1SrcReserves, transactionFee);
      const crsPerSrcPoolIn = new FixedDecimal(poolIn.summary.cost.crsPerSrc, poolIn.tokens.crs.decimals);
      const crsPerSrcPoolOut = new FixedDecimal(poolOut.summary.cost.crsPerSrc, poolOut.tokens.crs.decimals);
      const poolInUpdatedCrsReserves = pool0CrsReserves.subtract(quote[0].amountOut);
      const poolInUpdatedSrcReserves = pool0SrcReserves.add(quote[0].amountIn);
      const poolOutUpdatedCrsReserves = pool1CrsReserves.add(quote[1].amountIn);
      const poolOutUpdatedSrcReserves = pool1SrcReserves.subtract(quote[1].amountOut);
      const updatedCrsPerSrcPoolIn = poolInUpdatedCrsReserves.divide(poolInUpdatedSrcReserves);
      const updatedCrsPerSrcPoolOut = poolOutUpdatedCrsReserves.divide(poolOutUpdatedSrcReserves);

      currentMidPrice = crsPerSrcPoolIn.divide(crsPerSrcPoolOut);
      updatedMidPrice = updatedCrsPerSrcPoolIn.divide(updatedCrsPerSrcPoolOut);
    } else if (isCrsToSrc) {
      const quote = this.getAmountOut(tokenInAmount, pool0CrsReserves, pool0SrcReserves, transactionFee);
      const updatedCrsReserves = pool0CrsReserves.add(quote.amountIn);
      const updatedSrcReserves = pool0SrcReserves.subtract(quote.amountOut);

      currentMidPrice = new FixedDecimal(poolIn.summary.cost.srcPerCrs, poolIn.tokens.src.decimals);
      updatedMidPrice = updatedSrcReserves.divide(updatedCrsReserves);
    } else { // isSrcToCrs
      const quote = this.getAmountOut(tokenInAmount, pool0SrcReserves, pool0CrsReserves, transactionFee);
      const updatedCrsReserves = pool0CrsReserves.subtract(quote.amountOut);
      const updatedSrcReserves = pool0SrcReserves.add(quote.amountIn);

      currentMidPrice = new FixedDecimal(poolIn.summary.cost.crsPerSrc, poolIn.tokens.crs.decimals);
      updatedMidPrice = updatedCrsReserves.divide(updatedSrcReserves);
    }

    const priceImpact = currentMidPrice.subtract(updatedMidPrice).divide(currentMidPrice).multiply(FixedDecimal.NegativeOneHundred(8));

    // console.group('Price Impact');
    // console.log('currentMidPrice: ', currentMidPrice.formattedValue);
    // console.log('updatedMidPrice: ', updatedMidPrice.formattedValue);
    // console.log('priceImpact: ', priceImpact.formattedValue);
    // console.groupEnd();

    priceImpact.resize(2);

    return parseFloat(priceImpact.formattedValue);
  }
}
