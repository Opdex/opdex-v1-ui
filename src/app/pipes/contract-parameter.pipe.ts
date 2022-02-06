import { Pipe, PipeTransform } from "@angular/core";
import { FormatNumberPipe } from "./format-number.pipe";

@Pipe({
  name: 'contractParameter'
})
export class ContractParameterPipe implements PipeTransform {
  constructor(private _formatNumberPipe: FormatNumberPipe) { }

  transform(value: string): string {
    if (!!value === false) {
      return null;
    }

    const delimiterIndex = value.indexOf('#');

    if (delimiterIndex < 0) {
      return value;
    }

    const parts = value.split('#');

    // switch (parts[0]) {
    //   case '1': return parts[1]; // boolean
    //   case '2': return parts[1]; // byte
    //   case '3': return parts[1]; // char
    //   case '4': return parts[1]; // string
    //   case '5': return this._formatNumberPipe.transform(value[1], 0); // uint32
    //   case '6': return this._formatNumberPipe.transform(value[1], 0); // int32
    //   case '7': return this._formatNumberPipe.transform(value[1], 0); // uint64
    //   case '8': return this._formatNumberPipe.transform(value[1], 0); // int64
    //   case '9': return parts[1]; // address
    //   case '10': return parts[1]; // bytearray
    //   case '11': return this._formatNumberPipe.transform(value[1], 0); // uint128
    //   case '12': return this._formatNumberPipe.transform(value[1], 0); // uint256
    // }

    return parts[1];
  }
}
