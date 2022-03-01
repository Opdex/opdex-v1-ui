import { environment } from '@environments/environment';
import { SwUpdate } from "@angular/service-worker";

export const checkForUpdates = (swUpdate: SwUpdate): (() => Promise<any>) => {
  return (): Promise<void> =>
    new Promise(resolve => {
      console.log('checking for app updates...');

      if (environment.production) {
        swUpdate.checkForUpdate()
          .then(
            updateAvailable => {
              console.log(`Update Available: ${updateAvailable}`);
              if (updateAvailable) window.location.reload();
            },
            error => {
              console.error(error);
              window.location.reload();
            })
          .finally(() => resolve());
      }

      resolve();
    });
};
