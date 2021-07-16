import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  getSats(tokenDecimals: number) {
    if (tokenDecimals === 0) return 1;
    else if (tokenDecimals === 1) return 10;
    else if (tokenDecimals === 2) return 100;
    else if (tokenDecimals === 3) return 1_000;
    else if (tokenDecimals === 4) return 10_000;
    else if (tokenDecimals === 5) return 100_000;
    else if (tokenDecimals === 6) return 1_000_000;
    else if (tokenDecimals === 7) return 10_000_000;
    else if (tokenDecimals === 8) return 100_000_000;
    else if (tokenDecimals === 9) return 1_00_000_000;
    else if (tokenDecimals === 10) return 10_000_000_000;
    else if (tokenDecimals === 11) return 100_000_000_000;
    else if (tokenDecimals === 12) return 1_000_000_000_000;
    else if (tokenDecimals === 13) return 10_000_000_000_000;
    else if (tokenDecimals === 14) return 100_000_000_000_000;
    else if (tokenDecimals === 15) return 1_000_000_000_000_000;
    else if (tokenDecimals === 16) return 10_000_000_000_000_000;
    else if (tokenDecimals === 17) return 100_000_000_000_000_000;
    else return 1_000_000_000_000_000_000;
  }
}
