import { IMarket } from "@sharedModels/platform-api/responses/markets/market.interface";
import { StatCardInfo } from "@sharedModels/stat-card-info";
import { Icons } from "../enums/icons";

export class MarketStatCardsLookup {
  public static getStatCards(market: IMarket): StatCardInfo[] {
    return [
      {
        title: 'Liquidity',
        value: market?.summary?.liquidityUsd?.toString(),
        prefix: '$',
        change: market?.summary?.dailyLiquidityUsdChangePercent,
        show: true,
        icon: Icons.liquidityPool,
        iconColor: 'primary',
        helpInfo: {
          title: 'What is Liquidity?',
          paragraph: 'Liquidity represents the total USD amount of tokens locked in liquidity pools through provisioning. Liquidity can be measured for the market as a whole, or at an individual liquidity pool level.'
        }
      },
      {
        title: 'Staking',
        value: market?.summary?.staking?.stakingWeight,
        suffix: market?.stakingToken?.symbol,
        change: market?.summary?.staking?.dailyStakingWeightChangePercent,
        show: true,
        icon: Icons.staking,
        iconColor: 'stake',
        helpInfo: {
          title: 'What is Staking?',
          paragraph: 'Staking in liquidity pools acts as voting in the mining governance to enable liquidity mining. This indicator displays how many tokens are staking and can be represented for the market as a whole or at an individual staking pool level.'
        }
      },
      {
        title: 'Volume',
        value: market?.summary?.volumeUsd?.toString(),
        prefix: '$',
        daily: true,
        show: true,
        icon: Icons.volume,
        iconColor: 'provide',
        helpInfo: {
          title: 'What is Volume?',
          paragraph: 'Volume is the total USD value of tokens swapped and is usually displayed on a daily time frame. Volume tracks the value of tokens input to the protocol during swaps, plus transaction fees.'
        }
      },
      {
        title: 'Rewards',
        value: market?.summary?.rewards?.totalDailyUsd,
        daily: true,
        prefix: '$',
        show: true,
        icon: Icons.rewards,
        iconColor: 'reward',
        helpInfo: {
          title: 'What are Rewards?',
          paragraph: 'The rewards indicator displays the total USD value of transaction fees accumulated based on the volume of swap transactions. Rewards are collected by participants for providing liquidity and for staking in active markets.'
        }
      }
    ];
  }
}
