import { StatCardInfo } from "@sharedModels/stat-card-info";
import { IVaultResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-response-model.interface';
import { Token } from "@sharedModels/ui/tokens/token";
import { Icons } from "../enums/icons";
import { reduce } from "rxjs/operators";

export class VaultStatCardsLookup {
  public static getStatCards(vault: IVaultResponseModel, token: Token): StatCardInfo[] {
    return  [
      {
        title: 'Locked',
        value: vault?.tokensLocked,
        suffix: token?.symbol,
        icon: Icons.lock,
        iconColor: 'red',
        helpInfo: {
          title: 'Locked Tokens',
          paragraph: 'Locked tokens refers to the total number of tokens locked within the vault smart contract. As certificates are redeemed and tokens are collected, the supply will be reduced accordingly.'
        },
        show: true
      },
      {
        title: 'Unassigned',
        value: vault?.tokensUnassigned,
        suffix: token?.symbol,
        icon: Icons.tokens,
        iconColor: 'green',
        helpInfo: {
          title: 'Unassigned Tokens',
          paragraph: 'Unassigned tokens are tokens not currently assigned to certificates. The number of unassigned tokens changes as certificates are created or revoked.'
        },
        show: true
      },
      {
        title: 'Pledge Minimum',
        value: vault?.totalPledgeMinimum,
        suffix: 'CRS',
        icon: Icons.pledge,
        helpInfo: {
          title: 'Proposal Pledge Minimum',
          paragraph: 'The minimum number of CRS tokens required to collectively have pledged to move a proposal into the voting stage.'
        },
        show: true
      },
      {
        title: 'Vote Minimum',
        value: vault?.totalVoteMinimum,
        suffix: 'CRS',
        icon: Icons.proposal,
        iconColor: 'purple',
        helpInfo: {
          title: 'Proposal Vote Minimum',
          paragraph: 'The minimum number of CRS tokens required to collectively have voted on a proposal to have it measured for approval or denial.'
        },
        show: true
      }
    ]
  }
}
