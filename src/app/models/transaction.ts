import { FixedDecimal } from './types/fixed-decimal';
import { ISwapEvent } from './platform-api/responses/transactions/transaction-events/liquidity-pools/swap-event.interface';
import { TransactionSummaryTypes } from './../enums/transaction-summary-types';
import { TransactionEventTypes, txEventConverter } from "../enums/transaction-events";
import { Block } from "./block";
import { IBlock } from "./platform-api/responses/blocks/block.interface";
import { ITransactionEvent } from "./platform-api/responses/transactions/transaction-events/transaction-event.interface";
import { ITransactionReceipt } from "./platform-api/responses/transactions/transaction.interface";

export class TransactionReceipt {
  private _hash: string;
  private _from: string;
  private _to: string;
  private _newContractAddress?: string;
  private _gasUsed: number;
  private _block: Block;
  private _success: boolean;
  private _events: ITransactionEvent[];
  private _summaryType: TransactionSummaryTypes;

  public get hash(): string
  {
    return this._hash;
  }

  public get from(): string
  {
    return this._from;
  }

  public get to(): string
  {
    return this._to;
  }

  public get newContractAddress(): string | null
  {
    return this._newContractAddress;
  }

  public get gasUsed(): number
  {
    return this._gasUsed;
  }

  public get block(): IBlock
  {
    return this._block;
  }

  public get success(): boolean
  {
    return this._success;
  }

  public get events(): ITransactionEvent[]
  {
    return this._events;
  }

  public get summaryType(): TransactionSummaryTypes {
    return this._summaryType;
  }

  constructor(receipt: ITransactionReceipt) {
    this._hash = receipt.hash;
    this._from = receipt.from;
    this._to = receipt.to;
    this._newContractAddress = receipt.newContractAddress;
    this._gasUsed = receipt.gasUsed;
    this._block = new Block(receipt.block);
    this._success = receipt.success;
    this._events = receipt.events;
    this._summaryType = this.getSummaryType();
  }

  // This can be reduced as TransactionEvent classes are implemented where they map to their associated summary
  private getSummaryType(): TransactionSummaryTypes {
    const summaryTypes = this._events
      .map(event => {
        switch (txEventConverter(event.eventType)) {
          // Market deployer logs
          case TransactionEventTypes.CreateMarketEvent: return TransactionSummaryTypes.CreateMarket;
          case TransactionEventTypes.SetPendingDeployerOwnershipEvent: return TransactionSummaryTypes.SetPendingOwnership;
          case TransactionEventTypes.ClaimPendingDeployerOwnershipEvent: return TransactionSummaryTypes.ClaimPendingOwnership;

          // Market logs
          case TransactionEventTypes.CreateLiquidityPoolEvent: return TransactionSummaryTypes.CreateLiquidityPool;
          case TransactionEventTypes.SetPendingMarketOwnershipEvent: return TransactionSummaryTypes.SetPendingOwnership;
          case TransactionEventTypes.ClaimPendingMarketOwnershipEvent: return TransactionSummaryTypes.ClaimPendingOwnership;
          case TransactionEventTypes.ChangeMarketPermissionEvent: return TransactionSummaryTypes.ChangeMarketPermission;

          // Liquidity pool logs
          case TransactionEventTypes.AddLiquidityEvent: return TransactionSummaryTypes.AddLiquidity;
          case TransactionEventTypes.RemoveLiquidityEvent: return TransactionSummaryTypes.RemoveLiquidity;
          case TransactionEventTypes.SwapEvent:
            const crsIn = new FixedDecimal((<ISwapEvent>event).amountCrsIn, 8);
            if (!crsIn.isZero) return TransactionSummaryTypes.CrsToSrcSwap;
            const swapEvents = this._events.filter(e => txEventConverter(e.eventType) === TransactionEventTypes.SwapEvent);
            return swapEvents.length > 1 ? TransactionSummaryTypes.SrcToSrcSwap : TransactionSummaryTypes.SrcToCrsSwap;
          case TransactionEventTypes.StartStakingEvent: return TransactionSummaryTypes.StartStaking;
          case TransactionEventTypes.StopStakingEvent: return TransactionSummaryTypes.StopStaking;
          case TransactionEventTypes.CollectStakingRewardsEvent: return TransactionSummaryTypes.CollectStakingRewards;

          // Mining pool logs
          case TransactionEventTypes.StartMiningEvent: return TransactionSummaryTypes.StartMining;
          case TransactionEventTypes.StopMiningEvent: return TransactionSummaryTypes.StopMining;
          case TransactionEventTypes.CollectMiningRewardsEvent: return TransactionSummaryTypes.CollectMiningRewards;
          case TransactionEventTypes.EnableMiningEvent: return TransactionSummaryTypes.EnableMining;

          // Tokens
          case TransactionEventTypes.ApprovalEvent: return TransactionSummaryTypes.Approval;
          case TransactionEventTypes.TransferEvent: return TransactionSummaryTypes.Transfer;
          case TransactionEventTypes.DistributionEvent: return TransactionSummaryTypes.Distribution;

            // Mining governance logs
          case TransactionEventTypes.RewardMiningPoolEvent: return TransactionSummaryTypes.RewardMiningPool;
          case TransactionEventTypes.NominationEvent: return TransactionSummaryTypes.Nomination;

          // Vault
          case TransactionEventTypes.CreateVaultCertificateEvent: return TransactionSummaryTypes.CreateVaultCertificate;
          case TransactionEventTypes.RevokeVaultCertificateEvent: return TransactionSummaryTypes.RevokeVaultCertificate;
          case TransactionEventTypes.RedeemVaultCertificateEvent: return TransactionSummaryTypes.RedeemVaultCertificate;
          case TransactionEventTypes.SetPendingVaultOwnershipEvent: return TransactionSummaryTypes.SetPendingOwnership;
          case TransactionEventTypes.ClaimPendingVaultOwnershipEvent: return TransactionSummaryTypes.ClaimPendingOwnership;

          default: return null;
        }
      }).sort((a, b) => a - b);

      // Ranked in ascending order, the first one is the primary method.
      return summaryTypes[0];
  }
}
