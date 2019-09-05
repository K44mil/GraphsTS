import { Line } from './_svgModels';

export class Edge extends Line {

    private _v1: number;
    private _v2: number;
    private _points: string;
    private _weight: number;
    private _factor: number;
    private _isActive: boolean;

    constructor(
        id: number,
        v1: number,
        v2: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        weight: number = 0,
        factor: number = 1,
        isActive: boolean = false,
        stroke: string = 'black',
        strokeWidth: number = 3,
    ) {
        super(id, x1, y1, x2, y2, stroke, strokeWidth);
        this._v1 = v1;
        this._v2 = v2;
        this._weight = weight;
        this._factor = factor;
        this._isActive = isActive;
        this._points = '';

        const arrowX = (((x1 + x2) / 2) + x2) / 2
        const arrowY = (((y1 + y2) / 2) + y2) / 2;
        this._points += x1.toString() + ',' + y1.toString()
                     + ' ' + arrowX.toString() + ',' + arrowY.toString()
                     + ' ' + x2.toString() + ',' + y2.toString();
    }

    // Public methods
    setActive() {
        this._isActive = true;
        this._stroke = 'green';
        this._strokeWidth = 6;
    }

    setDisabled() {
        this._isActive = false;
        this._stroke = 'black';
        this._strokeWidth = 3;
    }

    setHighlighted() {
        this._stroke = "red";
        this._strokeWidth = 4;
    }

    setUnhighlighted() {
        this._stroke = 'black';
        this._strokeWidth = 3;
    }

    calcNewPoints() {
        const arrowX = (((this._x1 + this._x2) / 2) + this._x2) / 2
        const arrowY = (((this._y1 + this._y2) / 2) + this._y2) / 2;
        this._points = '';
        this._points += this._x1.toString() + ',' + this._y1.toString()
                     + ' ' + arrowX.toString() + ',' + arrowY.toString()
                     + ' ' + this._x2.toString() + ',' + this._y2.toString();
    }
    
    // Getters and Setters
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

    get points(): string {
        return this._points;
    }

    set points(val: string) {
        this._points = val;
    }

    get weight(): number {
        return this._weight;
    }

    set weight(val: number) {
        this._weight = val;
    }

    get factor(): number {
        return this._factor;
    }

    set factor(val: number) {
        this._factor = val;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(val: boolean) {
        this._isActive = val;
    }

}
