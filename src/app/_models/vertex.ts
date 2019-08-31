import { Circle } from './_svgModels';

export class Vertex extends Circle {

    private _isActive: boolean;

    constructor(
        id: number,
        cx: number,
        cy: number,
        r: number,
        fill: string = 'black',
        stroke: string = 'black',
        strokeWidth: number = 0,
        isActive: boolean = false
    ) {
        super(id, cx, cy, r, fill, stroke, strokeWidth);
        this._isActive = isActive;
    }

    // Public Methods
    setActive() {
        this._isActive = true;
        this._fill = 'green';
        this._stroke = 'aquamarine';
        this._strokeWidth = 3;
    }

    setDisabled() {
        this._isActive = false;
        this._fill = 'black';
        this._stroke = 'black';
        this._strokeWidth = 0;
    }
    
    setPathStartHighlight() {
        this._fill = 'yellow';
        this._stroke = 'green';
        this._strokeWidth = 3;
    }

    setPathEndHighlight() {
        this._fill = 'brown';
        this._stroke = 'red';
        this._strokeWidth = 3;
    }

    // Getters and Setters
    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(val: boolean) {
        this._isActive = val;
    }
}
