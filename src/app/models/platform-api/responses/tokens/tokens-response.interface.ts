import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IPaging } from '../paging.interface';

export interface ITokensResponse extends IPaging<IToken> {}
