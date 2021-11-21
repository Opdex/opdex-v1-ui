import { ILiquidityPoolSummary } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface";
import { Icons } from "../enums/icons";

export class PoolStatCardsLookup {
  public static getStatCards(pool:ILiquidityPoolSummary){
    return [
      {
        title: 'Liquidity',
        value: pool?.reserves?.usd?.toString(),
        prefix: '$',
        change: pool?.reserves?.usdDailyChange,
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
        value: pool?.staking?.weight,
        suffix: pool?.token?.staking?.symbol,
        change: pool?.staking?.weightDailyChange || 0,
        show: pool?.staking !== null && pool?.staking !== undefined,
        icon: Icons.staking,
        iconColor: 'stake',
        helpInfo: {
          title: 'What is Staking?',
          paragraph: 'Staking in liquidity pools acts as voting in the mining governance to enable liquidity mining. This indicator displays how many tokens are staking and can be represented for the market as a whole or at an individual staking pool level.'
        }
      },
      {
        title: 'Volume',
        value: pool?.volume?.usd?.toString(),
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
        value: pool?.rewards?.totalUsd?.toString(),
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
        value: pool?.mining?.tokensMining,
        suffix: pool?.token?.lp?.symbol,
        show: (pool?.mining !== null && pool?.mining !== undefined) && (pool?.mining?.isActive || pool?.mining?.tokensMining !== '0.00000000'),
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
