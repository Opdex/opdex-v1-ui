import { Component, OnInit } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';

@Component({
  selector: 'opdex-pairs',
  templateUrl: './pairs.component.html',
  styleUrls: ['./pairs.component.scss']
})
export class PairsComponent implements OnInit {
  pairs: any[];

  constructor(
    private _platformApiService: PlatformApiService
  ) {

  }

  async ngOnInit(): Promise<void> {
    const pairsResponse = await this._platformApiService.getPairs();
    if (pairsResponse.hasError || pairsResponse.data?.length) {
      // handle
    }

    this.pairs = pairsResponse.data;

    console.log(this.pairs);
  }
}
