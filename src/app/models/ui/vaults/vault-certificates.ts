import { IVaultCertificates } from '@sharedModels/platform-api/responses/vaults/vault-certificate.interface';
import { PagingResults } from '@sharedModels/ui/paging-results';
import { VaultCertificate } from './vault-certificate';

export class VaultCertificates extends PagingResults<VaultCertificate> {
  constructor(certificates: IVaultCertificates) {
    super(certificates.results.map(certificate => new VaultCertificate(certificate)), certificates.paging);
  }
}
