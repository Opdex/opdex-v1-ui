import { IBlock } from "@sharedModels/platform-api/responses/blocks/block.interface";

export class Block {
  private _height: number;
  private _hash: string;
  private _time: Date;
  private _medianTime: Date;

  public get height(): number {
    return this._height;
  }

  public get hash(): string {
    return this._hash;
  }

  public get time(): Date {
    return this._time;
  }

  public get medianTime(): Date {
    return this._medianTime;
  }

  constructor(block: IBlock) {
    this._height = block.height;
    this._hash = block.hash;
    this._time = block.time;
    this._medianTime = block.medianTime;
  }
}
