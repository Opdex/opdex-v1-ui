import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { StatCardInfo } from "@sharedModels/stat-card-info";
import { IVaultResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-response-model.interface';

export class VaultStatCardsLookup {
  public static getStatCards(vault: IVaultResponseModel, token: IToken): StatCardInfo[] {
    return  [
      {
        title: 'Locked',
        value: vault?.tokensLocked,
        suffix: token?.symbol,
        helpInfo: {
          title: 'Locked Tokens',
          paragraph: 'The locked tokens indicator displays how many governance tokens are currently locked within the vault contract. As certificates are redeemed and tokens are collected, the supply will be reduced accordingly.'
        },
        show: true
      },
      {
        title: 'Unassigned',
        value: vault?.tokensUnassigned,
        suffix: token?.symbol,
        helpInfo: {
          title: 'Unassigned Tokens',
          paragraph: 'Unassigned tokens is the balance of tokens not currently assigned to active certificates. As certificates are created and assigned to wallets, the amount of unassigned tokens is reduced accordingly.'
        },
        show: true
      },
      // {
      //   title: 'Proposed',
      //   value: vault?.tokensProposed,
      //   suffix: token?.symbol,
      //   helpInfo: {
      //     title: 'Proposed Tokens',
      //     paragraph: 'Proposed tokens are the number of tokens current requested in active create certificate proposals.'
      //   },
      //   show: true
      // },
      {
        title: 'Pledge Minimum',
        value: vault?.totalPledgeMinimum,
        suffix: 'CRS',
        helpInfo: {
          title: 'Proposal Pledge Minimum',
          paragraph: 'The minimum number of CRS tokens required to collectively have pledged to move a proposal on to a vote.'
        },
        show: true
      },
      {
        title: 'Vote Minimum',
        value: vault?.totalVoteMinimum,
        suffix: 'CRS',
        helpInfo: {
          title: 'Proposal Vote Minimum',
          paragraph: 'The minimum number of CRS tokens required to collectively have voted on a proposal to have it measured for approval or denial.'
        },
        show: true
      }
    ]
  }
}
