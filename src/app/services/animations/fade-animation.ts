import { trigger, transition, style, animate, query } from '@angular/animations';

export const FadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(
      ':enter', [
        style({ opacity: 0, marginTop: 0 }),
      ], { optional: true }
    ),
    query(
      ':enter', [
        style({ opacity: 0 }),
        animate('0.2s 150ms', style({ opacity: 1, marginTop: 0 }))
      ], { optional: true }
    )
  ])
]);
