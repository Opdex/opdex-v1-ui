import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Icons } from 'src/app/enums/icons';
import { HelpInfo } from "@sharedModels/help-info";

export class StatCardInfo {
    daily?: boolean;
    title: string;
    value: FixedDecimal;
    prefix?: string;
    suffix?: string;
    change?: number = null;
    helpInfo?: HelpInfo;
    show?: boolean;
    icon?: Icons;
    iconColor?: string;
}
