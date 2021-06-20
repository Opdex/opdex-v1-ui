import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';

@Component({
  selector: 'opdex-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  pools: any[];

  get poolsByVolume() {
    const pools = this.pools ? [...this.pools] : [];

    return pools.sort((a, b) => b.summary.volume.usd - a.summary.volume.usd);
  }

  constructor(private _platformApiService: PlatformApiService) { }

  async ngOnInit(): Promise<void> {
    const poolsResponse = await this._platformApiService.getPoolsByMarketAddress(environment.marketAddress);
    if (poolsResponse.hasError || poolsResponse.data?.length) {
      // handle
    }

    this.pools = poolsResponse.data;

    console.log(this.pools);
  }
}
