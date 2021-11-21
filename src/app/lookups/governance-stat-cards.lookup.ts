import { HelpInfo } from "@sharedModels/help-info";
import { IGovernance } from "@sharedModels/platform-api/responses/governances/governance.interface";
import { StatCardInfo } from "@sharedModels/stat-card-info";

export class GovernanceStatCardsLookup {
  public static getStatCards(){
    return {
      nominationsHelpInfo: {
        title: 'What are nominations?',
        paragraph: 'Every month (164,250 blocks), the top 4 liquidity pools by staking weight at the end of the nomination period will have liquidity mining enabled.'
      },
      rewardsHelpInfo: {
        title: 'What are rewards?',
        paragraph: 'Rewards are the mined tokens distributed to mining pools after successful nominations. Every 12 periods, the number of mining tokens per nomination adjusts with the governance token distribution schedule.'
      }
    }
  }
}
