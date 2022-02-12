import { WrappedToken } from '@sharedModels/ui/tokens/wrapped-token';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-token-native-chain-badge',
  templateUrl: './token-native-chain-badge.component.html',
  styleUrls: ['./token-native-chain-badge.component.scss']
})
export class TokenNativeChainBadgeComponent {
  @Input() wrappedToken: WrappedToken;
}
