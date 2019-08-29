
export class Vertex {

    private _id: number;
    private _cx: number;
    private _cy: number;
    private _r: number;
    private _fill: string;
    private _stroke: string;
    private _strokeWidth: number;
    private _isActive: boolean;

    // Constructor
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
        this._id = id;
        this._cx = cx;
        this._cy = cy;
        this._r = r;
        this._fill = fill;
        this._stroke = stroke;
        this._strokeWidth = strokeWidth;
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

    setPathBeginHighlight() {
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
    get id(): number {
        return this._id;
    }

    set id(val: number) {
        this._id = val;
    }

    get cx(): number {
        return this._cx;
    }

    set cx(val: number) {
        this._cx = val;
    }

    get cy(): number {
        return this._cy;
    }

    set cy(val: number) {
        this._cy = val;
    }

    get r(): number {
        return this._r;
    }

    set r(val: number) {
        this._r = val;
    }

    get fill(): string {
        return this._fill;
    }

    set fill(val: string) {
        this._fill = val;
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
