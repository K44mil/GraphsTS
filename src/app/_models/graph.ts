export class Graph {

    private _id: number;
    private _name: string;

    // Constructor
    constructor(
        id: number,
        name: string = ''
    ) {
        this._id = id;
        this._name = name;
    }

    // Getters and Setters
    get id(): number {
        return this._id;
    }

    set id(val: number) {
        this._id = val;
    }

    get name(): string {
        return this._name;
    }

    set name(val: string) {
        this._name = val;
    }


}
