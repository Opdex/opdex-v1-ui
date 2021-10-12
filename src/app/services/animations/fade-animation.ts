import { trigger, transition, style, animate, query } from '@angular/animations';

export const FadeAnimation = trigger('fadeAnimation', [
  // route 'enter and leave (<=>)' transition
  transition('*<=>*', [

    // css styles at start of transition
    style({ opacity: 0 }),

    // animation and styles at end of transition
    animate('0.4s', style({ opacity: 1 }))
  ]),
]);
