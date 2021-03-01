import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortAddress'
})
export class ShortAddressPipe implements PipeTransform {
    transform(address: string, length: number = 4): string {
        const firstPart = address.substring(0, length);
        const secondPart = address.substring(address.length - length, address.length);

        return `${firstPart}...${secondPart}`;
    }
}
