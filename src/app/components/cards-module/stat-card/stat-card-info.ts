import { Icons } from 'src/app/enums/icons';
import { HelpInfo } from "@sharedComponents/modals-module/help-modal/help-info";

export class StatCardInfo {
    daily?: boolean;
    title: string;
    value: string;
    prefix?: string;
    suffix?: string;
    change?: number = null;
    helpInfo?: HelpInfo;
    show?: boolean;
    icon?: Icons;
    iconColor?: string;
}
