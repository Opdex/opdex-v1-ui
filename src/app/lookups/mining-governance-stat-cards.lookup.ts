export class MiningGovernanceStatCardsLookup {
  public static getStatCards(){
    return {
      nominationsHelpInfo: {
        title: 'What are nominations?',
        paragraph: 'Every month (164,250 blocks), the top four liquidity pools by staking weight at the end of the nomination period will have liquidity mining enabled.'
      },
      rewardsHelpInfo: {
        title: 'What are rewards?',
        paragraph: 'Rewards are the mined tokens distributed to mining pools after successful nominations. Every 12 periods, the number of mining tokens per nomination adjusts with the governance token distribution schedule.'
      }
    }
  }
}
