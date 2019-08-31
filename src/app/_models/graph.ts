import { Vertex, Edge, Loop } from './';

export class Graph {

    private _id: number;
    private _vertexs: Vertex[];
    private _edges: Edge[];
    private _loops: Loop[];
    private _name: string;
    private _isDigraph: boolean;
    private _isSaved: boolean;

    // Constructor
    constructor(
        id: number,   
        vertexs: Vertex[] = [],
        edges: Edge[] = [],
        loops: Loop[] = [],
        name: string = '',
        isDigraph: boolean = false,
        isSaved: boolean = false
    ) {
        this._id = id;
        this._vertexs = vertexs;
        this._edges = edges;
        this._loops = loops;
        this._name = name;
        this._isDigraph = isDigraph;
        this._isSaved = isSaved;
    }

    // Getters and Setters
    get id(): number {
        return this._id;
    }

    set id(val: number) {
        this._id = val;
    }

    get vertexs(): Vertex[] {
        return this._vertexs;
    }

    set vertexs(val: Vertex[]) {
        this._vertexs = val;
    }

    get edges(): Edge[] {
        return this._edges;
    }

    set edges(val: Edge[]) {
        this._edges = val;
    }

    get loops(): Loop[] {
        return this._loops;
    }

    set loops(val: Loop[]) {
        this._loops = val;
    }

    get name(): string {
        return this._name;
    }

    set name(val: string) {
        this._name = val;
    }

    get isDigraph(): boolean {
        return this._isDigraph;
    }

    get isSaved(): boolean {
        return this._isSaved;
    }

    set isSaved(val: boolean) {
        this._isSaved = val;
    }
}
