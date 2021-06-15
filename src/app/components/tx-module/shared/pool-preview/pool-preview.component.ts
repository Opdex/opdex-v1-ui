import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-pool-preview',
  templateUrl: './pool-preview.component.html',
  styleUrls: ['./pool-preview.component.scss']
})
export class PoolPreviewComponent {
  @Input() pool: any;

  clearPool() {
    this.pool = null;
  }
}
