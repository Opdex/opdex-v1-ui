import { Component, OnInit } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';

@Component({
  selector: 'opdex-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  pools: any[];

  constructor(
    private _platformApiService: PlatformApiService
  ) {

  }

  async ngOnInit(): Promise<void> {
    const poolsResponse = await this._platformApiService.getPools();
    if (poolsResponse.hasError || poolsResponse.data?.length) {
      // handle
    }

    this.pools = poolsResponse.data;

    console.log(this.pools);
  }
}
