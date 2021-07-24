import { HelpInfo } from "@sharedComponents/modals-module/help-modal/help-info";

export class StatCardInfo {
    daily?: boolean;
    title: string;
    value: string;
    symbol?: string;
    formatNumber?: number;
    change?: number = null;
    helpInfo?: HelpInfo;
}