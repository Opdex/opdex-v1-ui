import { Component } from '@angular/core';
import { StatCardInfo } from '@sharedComponents/cards-module/stat-card/stat-card-info';

@Component({
  selector: 'opdex-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent {
  statCards: StatCardInfo[] = [
    {
      title: 'Locked Tokens', 
      value: '1000000',
      formatNumber: 0,
      postSymbol: 'ODX',
      helpInfo: {
        title: 'Locked Tokens Help',
        paragraph: 'This modal is providing help for Locked Tokens.'
      }
    },
    {
      title: 'Unassigned Tokens', 
      value: '500000',
      formatNumber: 0,
      postSymbol: 'ODX',
      helpInfo: {
        title: 'Unassigned Tokens Help',
        paragraph: 'This modal is providing help for Unassigned Tokens.'
      }
    },
    {
      title: 'Collected Tokens', 
      value: '0',
      formatNumber: 0,
      postSymbol: 'ODX',
      helpInfo: {
        title: 'Price Collected Tokens',
        paragraph: 'This modal is providing help for Collected Tokens.'
      }
    },
    {
      title: 'Maximum Tokens', 
      value: '2500000',
      postSymbol: 'ODX',
      formatNumber: 0,
      helpInfo: {
        title: 'Price Help',
        paragraph: 'This modal is providing help for Maximum Tokens.'
      }
    }
  ];
}
