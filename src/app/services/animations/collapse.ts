import { trigger, transition, style, animate, state, AUTO_STYLE } from '@angular/animations';

export const CollapseAnimation = trigger('collapse', [
  state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE, opacity: 1 })),
  state('true', style({ height: '0', visibility: 'hidden', opacity: 0 })),
  transition('false => true', animate(200 + 'ms ease-in')),
  transition('true => false', animate(200 + 'ms ease-out'))
])


