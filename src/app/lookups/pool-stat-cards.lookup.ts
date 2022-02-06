import { LiquidityPool } from "@sharedModels/ui/liquidity-pools/liquidity-pool";
import { Icons } from "../enums/icons";

export class PoolStatCardsLookup {
  public static getStatCards(pool: LiquidityPool) {
    console.log(pool?.miningPool)
    return [
      {
        title: 'Liquidity',
        value: pool?.summary?.reserves?.usd?.toFixed(8),
        prefix: '$',
        change: pool?.summary?.reserves?.dailyUsdChangePercent,
        show: true,
        icon: Icons.liquidityPool,
        iconColor: 'primary',
        helpInfo: {
          title: 'What is Liquidity?',
          paragraph: 'Liquidity represents the total USD amount of paired tokens locked in a liquidity pool smart contract.'
        }
      },
      {
        title: 'Staking',
        value: pool?.summary?.staking?.weight?.formattedValue,
        suffix: pool?.summary?.staking?.token?.symbol,
        change: pool?.summary?.staking?.dailyWeightChangePercent || 0,
        show: pool?.summary?.staking !== null && pool?.summary?.staking !== undefined,
        icon: Icons.staking,
        iconColor: 'stake',
        helpInfo: {
          title: 'What is Staking?',
          paragraph: 'Staking represents tokens locked and voted in favor of a liquidity pool having liquidity mining enabled.'
        }
      },
      {
        title: 'Volume',
        value: pool?.summary?.volume?.dailyUsd?.toFixed(8),
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
        value: pool?.summary?.rewards?.totalDailyUsd?.toFixed(8),
        daily: true,
        prefix: '$',
        show: true,
        icon: Icons.rewards,
        iconColor: 'reward',
        helpInfo: {
          title: 'What are Rewards?',
          paragraph: 'Rewards are the value tokens distributed between liquidity providers and staking participants originating from swap transaction fees.'
        }
      },
      {
        title: 'Mining',
        value: pool?.miningPool?.tokensMining?.formattedValue,
        suffix: pool?.tokens?.lp?.symbol,
        show: !!pool?.miningPool && (pool.miningPool.isActive || pool.miningPool.tokensMining?.isZero !== true),
        icon: Icons.mining,
        iconColor: 'mine',
        helpInfo: {
          title: 'What is Liquidity Mining?',
          paragraph: 'Liquidity mining is how governance staking token are distributed. Provide liquidity to a pool that has enabled liquidity mining and stake the provided liquidity in a mining pool to collect mining rewards by position weight.'
        }
      }
    ];
  }
}
