import { Polygon } from './_svgModels';

export class Arrow extends Polygon {

    _e: number;

    constructor(
        id: number,
        e: number,
        x: number[],
        y: number[],
        fill: string = 'black'
    ) {
       super(id, x, y, fill);
       this._e = e;
    }

    get e(): number {
        return this._e;
    }

    set e(val: number) {
        this._e = val;
    }
}