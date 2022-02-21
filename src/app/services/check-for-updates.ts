import { SwUpdate } from "@angular/service-worker";

export const checkForUpdates = (swUpdate: SwUpdate): (() => Promise<any>) => {
  return (): Promise<void> =>
    new Promise(resolve => {
      swUpdate.checkForUpdate();

      swUpdate.versionUpdates
        .subscribe(() => window.location.reload());

      resolve();
    });
};
