import { Vertex, Edge, Loop, Arrow } from './';

export class Graph {

    private _id: number;
    private _vertices: Vertex[];
    private _edges: Edge[];
    private _loops: Loop[];
    private _arrows: Arrow[];
    private _name: string;
    private _isDigraph: boolean;
    private _isSaved: boolean;

    // Constructor
    constructor(
        id: number,   
        vertices: Vertex[] = [],
        edges: Edge[] = [],
        loops: Loop[] = [],
        arrows: Arrow[] =[],
        name: string = '',
        isDigraph: boolean = false,
        isSaved: boolean = false
    ) {
        this._id = id;
        this._vertices = vertices;
        this._edges = edges;
        this._loops = loops;
        this._arrows = arrows;
        this._name = name;
        this._isDigraph = isDigraph;
        this._isSaved = isSaved;
    }

    // Public Methods
    getVertexById(id: number): Vertex {
        let result: Vertex = null;
        if (this._vertices.length >= id)
            result = this._vertices[id];   
        return result;
    }

    getLoopById(id: number): Loop {
        let result: Loop = null;
        if (this._loops.length >= id)
            result = this._loops[id];
        return result;
    }

    getLoopByVertexId(id: number): Loop {
        let result: Loop = null;
        this._loops.forEach(l => {
            if (l.v === id)
                result = l;
        });
        return result;
    }

    getEdgeById(id: number): Edge {
        let result: Edge = null;
        if (this._edges.length >= id)
            result = this._edges[id];
        return result;
    }

    getEdgesByVertexId(id: number): Edge[] {
        let result: Edge[] = [];
        this._edges.forEach(e => {
            if (e.v1 === id || e.v2 === id)
                result.push(e);
        });
        return result;
    }

    getEdgesByStartVertexId(id: number): Edge[] {
        let result: Edge[] = [];
        this._edges.forEach(e => {
            if (e.v1 === id)
                result.push(e);
        });
        return result;
    }

    getEdgesByEndVertexId(id: number): Edge[] {
        let result: Edge[] = [];
        this._edges.forEach(e => {
            if (e.v2 === id)
                result.push(e);
        });
        return result;
    }

    getEdgeByVerticesIds(v1: number, v2: number): Edge {
        let result: Edge = null;
        this._edges.forEach(e => {
            if (e.v1 === v1 && e.v2 === v2)
                result = e;
        });
        return result;
    }

    deleteVertexById(id: number): Vertex {
        let result: Vertex = null;
        const filterResult = this._vertices.filter(v => v.id === id)
        if (filterResult.length > 0)
            result = filterResult[0];
        this._vertices = this._vertices.filter(v => v.id !== id);
        this.deleteEdgesConnectedToVertex(result.id);
        this.deleteLoopsConnectedToVertex(result.id);
        this.updateVerticesIds();
        return result;
    }

    deleteEdgeById(id: number): Edge {
        let result: Edge = null;
        const filterResult = this._edges.filter(e => e.id === id);
        if (filterResult.length > 0)
            result = filterResult[0];
        this._edges = this._edges.filter(e => e.id !== id);
        this.updateEdgesIds();
        return result;
    }

    deleteLoopById(id: number): Loop {
        let result: Loop = null;
        const filterResult = this._loops.filter(l => l.id === id);
        if (filterResult.length > 0)
            result = filterResult[0];
        this._loops = this._loops.filter(l => l.id !== id);
        this.updateLoopsIds();
        return result;
    }

    updateEdgesCoords(vertex: Vertex) {
    this._edges.forEach(e => {
        if (e.v1 === vertex.id) {
            e.x1 = vertex.cx;
            e.y1 = vertex.cy;
            e.calcNewPoints();
        } else if (e.v2 === vertex.id) {
            e.x2 = vertex.cx;
            e.y2 = vertex.cy;
            e.calcNewPoints();
        }
        });
    }

    updateLoopsCoords(vertex: Vertex) {
        this._loops.forEach(l => {
            if (l.v === vertex.id) {
                l.cx = vertex.cx + vertex.r;
                l.cy = vertex.cy + vertex.r;
            }
        });
    }

    edgeExists(v1: number, v2: number): boolean {
        let result: boolean = false;
        this._edges.forEach(e => {
            if (e.v1 === v1 && e.v2 === v2) {
                result = true;
            }
        });
        return result;
    }

    // Private Methods
    private deleteEdgesConnectedToVertex(id: number): Edge[] {
        let result: Edge[] = this.getEdgesByVertexId(id);
        result.forEach(e => {
            this.deleteEdgeById(e.id);
        });
        return result;
    }
    private deleteLoopsConnectedToVertex(id: number): Loop {
        let result: Loop = this.getLoopByVertexId(id);
        if (result)
            this.deleteLoopById(result.id);
        return result;
    }

    private updateVerticesIds(): void {
        let id = 0;
        this._vertices.forEach(v => {
          this.updateEdgesVertexId(v.id, id);
          v.id = id++;
        });
    }

    private updateEdgesIds(): void {
        let id = 0;
        this._edges.forEach(e => {
            e.id = id++;
        });
    }

    private updateLoopsIds(): void {
        let id = 0;
        this._loops.forEach(l => {
            l.id = id++;
        });
    }

    private updateEdgesVertexId(oldId: number, newId: number): void {
        this._edges.forEach(e => {
            if (e.v1 === oldId) {
              e.v1 = newId;
            } else if (e.v2 === oldId) {
              e.v2 = newId;
            }
          });
    }

    // Getters and Setters
    get id(): number {
        return this._id;
    }

    set id(val: number) {
        this._id = val;
    }

    get vertices(): Vertex[] {
        return this._vertices;
    }

    set vertices(val: Vertex[]) {
        this._vertices = val;
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

    get arrows(): Arrow[] {
        return this._arrows;
    }

    set arrows(val: Arrow[]) {
        this._arrows = val;
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
