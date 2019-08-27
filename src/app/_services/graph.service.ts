import { Injectable } from '@angular/core';
import { Graph, Vertex, Edge } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private _graph: Graph;
  private _vertexs: Vertex[] = [];
  private _edges: Edge[] = [];

  constructor() { }

  initNewGraph() {
    const savedGraphs = JSON.parse(localStorage.getItem('graphs')) || [];
    const newGraphId = savedGraphs.length ? Math.max(...savedGraphs.map(x => x.id)) + 1 : 1;
    this._graph = new Graph(newGraphId);
    this._vertexs = [];
    this._edges = [];
  }

  removeCurrentGraph() {
    this._graph = undefined;
    this._vertexs = [];
    this._edges = [];
  }

  addEdge(edge: Edge) {
    this._edges.push(edge);
  }

  get graph(): Graph {
    return this._graph;
  }

  get vertexs(): Vertex[] {
    return this._vertexs;
  }

  get edges(): Edge[] {
    return this._edges;
  }
}
