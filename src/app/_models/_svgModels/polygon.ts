export class Polygon {

    protected _id: number;
    protected _x: number[];
    protected _y: number[];
    protected _points: string;
    protected _fill: string;

    constructor(
        id: number,
        x: number[],
        y: number[],
        fill: string = 'black'
    ) {
        if (x.length !== y.length) {
            x = [];
            y = [];
            this._points = '';
        } else {
            for (let i = 0; i < x.length; i++) {
                this._points += x.toString() + ',' + y.toString() + ' ';
            }
        }
        this._id = id;
        this._x = x;
        this._y = y;
        this._fill = fill;
    }

    get id(): number {
        return this._id;
    }

    set id(val: number) {
        this._id = val;
    }

    get x(): number[] {
        return this._x;
    }

    set x(val: number[]) {
        this._x = val;
    }

    get y(): number[] {
        return this._y;
    }

    set y(val: number[]) {
        this._y = val;
    }

    get points(): string {
        return this._points;
    }

    set points(val: string) {
        this._points = val;
    }

    get fill(): string {
        return this._fill;
    }

    set fill(val: string) {
        this._fill = val;
    }
}