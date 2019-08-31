import { Circle } from './_svgModels';

export class Loop extends Circle {
    
    private _v: number;
    private _factor: number;
    private _isActive: boolean;

    constructor(
        id: number,
        v: number,
        cx: number,
        cy: number,
        r: number,
        fill: string = 'none',
        stroke: string = 'black',
        strokeWidth: number = 3,
        factor: number = 1,
        isActive: boolean = false
    ) {
        super(id, cx, cy, r, fill, stroke, strokeWidth);
        this._v = v;
        this._factor = factor;
        this._isActive = isActive;
    }

    // Public Methods
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

    // Getters and Setters
    get v(): number {
        return this._v;
    }

    set v(val: number) {
        this._v = val;
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