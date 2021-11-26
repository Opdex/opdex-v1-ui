import { ILiquidityPoolResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";
import { Icons } from "../enums/icons";

export class PoolStatCardsLookup {
  public static getStatCards(pool:ILiquidityPoolResponse){
    return [
      {
        title: 'Liquidity',
        value: pool?.summary?.reserves?.usd?.toString(),
        prefix: '$',
        change: pool?.summary?.reserves?.dailyUsdChangePercent,
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
        value: pool?.summary?.staking?.weight,
        suffix: pool?.summary?.staking?.token?.symbol,
        change: pool?.summary?.staking?.dailyWeightChangePercent || 0,
        show: pool?.summary?.staking !== null && pool?.summary?.staking !== undefined,
        icon: Icons.staking,
        iconColor: 'stake',
        helpInfo: {
          title: 'What is Staking?',
          paragraph: 'Staking in liquidity pools acts as voting in the mining governance to enable liquidity mining. This indicator displays how many tokens are staking and can be represented for the market as a whole or at an individual staking pool level.'
        }
      },
      {
        title: 'Volume',
        value: pool?.summary?.volume?.dailyUsd?.toString(),
        prefix: '$',
        daily: true,
        show: true,
        icon: Icons.volume,
        iconColor: 'provide',
        helpInfo: {
          title: 'What is Volume?',
          paragraph: 'Volume is the total USD value of tokens swapped and is usually displayed on a daily time frame. Volume tracks the value of tokens input to the protocol during swaps including transaction fees.'
        }
      },
      {
        title: 'Rewards',
        value: pool?.summary?.rewards?.totalDailyUsd?.toString(),
        daily: true,
        prefix: '$',
        show: true,
        icon: Icons.rewards,
        iconColor: 'reward',
        helpInfo: {
          title: 'What are Rewards?',
          paragraph: 'The rewards indicator displays the total USD value of transaction fees accumulated based on the volume of swap transactions. Rewards are collected by participants for providing liquidity and for staking in active markets.'
        }
      },
      {
        title: 'Mining',
        value: pool?.summary?.miningPool?.tokensMining,
        suffix: pool?.token?.lp?.symbol,
        show: (pool?.summary?.miningPool !== null && pool?.summary?.miningPool !== undefined) && (pool?.summary?.miningPool?.isActive || pool?.summary?.miningPool?.tokensMining !== '0.00000000'),
        icon: Icons.mining,
        iconColor: 'mine',
        helpInfo: {
          title: 'What is Liquidity Mining?',
          paragraph: 'Liquidity mining is when new governance tokens are mined, from liquidity that is provided and staked in mining pools. This indicator displays the totals currently used for mining within the liquidity pool, whether liquidity mining is currently active or not.'
        }
      }
    ];
  }
}
