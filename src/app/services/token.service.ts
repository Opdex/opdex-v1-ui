import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  getSats(tokenDecimals: number) {
    if (tokenDecimals === 0) return 1;
    else if (tokenDecimals === 1) return 10;
    else if (tokenDecimals === 2) return 100;
    else if (tokenDecimals === 3) return 1000;
    else if (tokenDecimals === 4) return 10000;
    else if (tokenDecimals === 5) return 100000;
    else if (tokenDecimals === 6) return 1000000;
    else if (tokenDecimals === 7) return 10000000;
    else if (tokenDecimals === 8) return 10000000;
    else if (tokenDecimals === 9) return 100000000;
    else if (tokenDecimals === 10) return 1000000000;
    else if (tokenDecimals === 11) return 10000000000;
    else if (tokenDecimals === 12) return 100000000000;
    else if (tokenDecimals === 13) return 1000000000000;
    else if (tokenDecimals === 14) return 10000000000000;
    else if (tokenDecimals === 15) return 100000000000000;
    else if (tokenDecimals === 16) return 1000000000000000;
    else if (tokenDecimals === 17) return 10000000000000000;
    else return 100000000000000000;
  }
}
