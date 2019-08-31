export class Line {

    protected _id: number;
    protected _x1: number;
    protected _y1: number;
    protected _x2: number;
    protected _y2: number;
    protected _stroke: string;
    protected _strokeWidth: number;

    constructor(
        id: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        stroke: string = 'black',
        strokeWidth: number = 3,
    ) {
        this._id = id;
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        this._stroke = stroke;
        this._strokeWidth = strokeWidth;
    }

    // Getters and Setters
    get id(): number {
        return this._id;
    }

    set id(val: number) {
        this._id = val;
    }

    get x1(): number {
        return this._x1;
    }

    set x1(val: number) {
        this._x1 = val;
    }

    get y1(): number {
        return this._y1;
    }

    set y1(val: number) {
        this._y1 = val;
    }

    get x2(): number {
        return this._x2;
    }

    set x2(val: number) {
        this._x2 = val;
    }

    get y2(): number {
        return this._y2;
    }

    set y2(val: number) {
        this._y2 = val;
    }

    get stroke(): string {
        return this._stroke;
    }

    set stroke(val: string) {
        this._stroke = val;
    }

    get strokeWidth(): number {
        return this._strokeWidth;
    }

    set strokeWidth(val: number) {
        this._strokeWidth = val;
    }
}
