import { SwUpdate } from "@angular/service-worker";

export const checkForUpdates = (swUpdate: SwUpdate): (() => Promise<any>) => {
  return (): Promise<void> =>
    new Promise(resolve => {
      swUpdate.checkForUpdate();

      console.log('checking for update...');

      swUpdate.versionUpdates
        .subscribe(() => window.location.reload());

      resolve();
    });
};
