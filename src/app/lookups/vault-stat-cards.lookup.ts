import { IVault } from "@sharedModels/platform-api/responses/vaults/vault.interface";
import { StatCardInfo } from "@sharedModels/stat-card-info";

export class VaultStatCardsLookup {
  public static getStatCards(vault: IVault): StatCardInfo[] {
    return  [
      {
        title: 'Locked',
        value: vault?.tokensLocked,
        suffix: vault?.lockedToken?.symbol,
        helpInfo: {
          title: 'Locked Tokens',
          paragraph: 'The locked tokens indicator displays how many governance tokens are currently locked within the vault contract. As certificates are redeemed and tokens are collected, the supply will be reduced accordingly.'
        },
        show: true
      },
      {
        title: 'Unassigned',
        value: vault?.tokensUnassigned,
        suffix: vault?.lockedToken?.symbol,
        helpInfo: {
          title: 'Unassigned Tokens',
          paragraph: 'Unassigned tokens is the balance of tokens not currently assigned to active certificates. As certificates are created and assigned to wallets, the amount of unassigned tokens is reduced accordingly.'
        },
        show: true
      }
    ]
  }
}
