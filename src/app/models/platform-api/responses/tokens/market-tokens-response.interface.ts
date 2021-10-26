import { IMarketToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IPaging } from '../paging.interface';

export interface IMarketTokensResponse extends IPaging<IMarketToken> {}
