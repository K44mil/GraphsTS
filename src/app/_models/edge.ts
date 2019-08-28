export class Edge {

    private _id: number;
    private _v1: number;
    private _v2: number;
    private _x1: number;
    private _x2: number;
    private _y1: number;
    private _y2: number;
    private _stroke: string;
    private _strokeWidth: number;
    private _isActive: boolean;

    // Constructor
    constructor(
        id: number,
        v1: number,
        v2: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        stroke: string = 'black',
        strokeWidth: number = 3,
        isActive: boolean = false
    ) {
        this._id = id;
        this._v1 = v1;
        this._v2 = v2;
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        this._stroke = stroke;
        this._strokeWidth = strokeWidth;
        this._isActive = isActive;
    }

    // Public methods
    setActive() {
        this._isActive = true;
        this._stroke = 'green';
        this._strokeWidth = 5;
    }

    setDisabled() {
        this._isActive = false;
        this._stroke = 'black';
        this._strokeWidth = 3;
    }
    
    // Getters and Setters
    get id(): number {
        return this._id;
    }

    set id(val: number) {
        this._id = val;
    }

    get v1(): number {
        return this._v1;
    }

    set v1(val: number) {
        this._v1 = val;
    }

    get v2(): number {
        return this._v2;
    }

    set v2(val: number) {
        this._v2 = val;
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

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(val: boolean) {
        this._isActive = val;
    }

}
