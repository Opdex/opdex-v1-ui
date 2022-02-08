import { Market } from '@sharedModels/ui/markets/market';
import { StatCardInfo } from "@sharedModels/stat-card-info";
import { Icons } from "../enums/icons";

export class MarketStatCardsLookup {
  public static getStatCards(market: Market): StatCardInfo[] {
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
          paragraph: `Liquidity represents the total USD amount of tokens locked in liquidity pool's within a market.`
        }
      },
      {
        title: 'Staking',
        value: market?.summary?.staking?.stakingWeight?.formattedValue,
        suffix: market?.tokens?.staking?.symbol,
        change: market?.summary?.staking?.dailyStakingWeightChangePercent,
        show: true,
        icon: Icons.staking,
        iconColor: 'stake',
        helpInfo: {
          title: 'What is Staking?',
          paragraph: 'Staking represents tokens locked and voting in favor of a liquidity pool having liquidity mining enabled.'
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
          paragraph: 'Volume is the total USD value of tokens input for swap transactions which includes transaction fees.'
        }
      },
      {
        title: 'Rewards',
        value: market?.summary?.rewards?.totalDailyUsd?.toString(),
        daily: true,
        prefix: '$',
        show: true,
        icon: Icons.rewards,
        iconColor: 'reward',
        helpInfo: {
          title: 'What are Rewards?',
          paragraph: 'Rewards are the value tokens distributed between liquidity providers and staking participants originating from swap transaction fees.'
        }
      }
    ];
  }
}
