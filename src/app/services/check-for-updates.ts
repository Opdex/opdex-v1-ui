import { SwUpdate } from "@angular/service-worker";

export const checkForUpdates = (swUpdate: SwUpdate): (() => Promise<any>) => {
  return (): Promise<void> =>
    new Promise(resolve => {
      console.log('checking for update in promise...');

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
    });
};
