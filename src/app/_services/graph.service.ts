import { Injectable } from '@angular/core';
import { Graph, Vertex, Edge } from '../_models';
import { SvgGraphicsService } from './svg-graphics.service';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private _graph: Graph;
  private _vertexs: Vertex[];
  private _edges: Edge[];
  private _selectedElement: any;
  private _selectedDraggedVertex: Vertex;

  constructor(
    private svgGraphicsService: SvgGraphicsService
  ) { }

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

  removeSelectedElements() {
    if (this._selectedElement) {
      if (this.isSelectedElementVertex) {
        this.deleteVertex(this._selectedElement.id);
        this.deleteEdgesConnectedToVertex(this._selectedElement.id);
        this._selectedElement.setDisabled();
        this._selectedElement = null;
      } else if (this.isSelectedElementEdge) {
        this.deleteEdge(this._selectedElement.id);
        this._selectedElement.setDisabled();
        this._selectedElement = null;
      }
    }
  }

  addNewVertex(e: MouseEvent) {
    if (e.target instanceof SVGSVGElement) {
      const { x, y } = this.svgGraphicsService.parsePoint(e);
      const newVertexId = this._vertexs.length ? Math.max(...this._vertexs.map(x => x.id)) + 1 : 1;
      const vertex = new Vertex(newVertexId, x, y, 15);
      this.addVertex(vertex);
    }
  }

  addNewEdge(v1: Vertex, v2: Vertex) {
    if (!this.edgeExists(v1.id, v2.id)) {
      const newEdgeId = this._edges.length ? Math.max(...this._edges.map(x => x.id)) + 1 : 1;
      const edge = new Edge(newEdgeId, v1.id, v2.id, v1.cx, v1.cy, v2.cx, v2.cy);
      this.addEdge(edge);
    }
  }

  onClickVertex(id: number) {
    const vertex = this.getVertexById(id);
    if (this.isSelectedElementVertex) {
      if (this._selectedElement === vertex) {
        this._selectedElement.setDisabled();
        this._selectedElement = null;
      } else {
        this.addNewEdge(this._selectedElement, vertex);
        this._selectedElement.setDisabled();
        this._selectedElement = null;
      }
    } else if (this.isSelectedElementEdge) {
      this._selectedElement.setDisabled();
      this._selectedElement = vertex;
      this._selectedElement.setActive();
    } else {
      this._selectedElement = vertex;
      this._selectedElement.setActive();
    }
  }

  onClickEdge(id: number) {
    const edge = this.getEdgeById(id);
    if (!this._selectedElement) {
      this._selectedElement = edge;
      this._selectedElement.setActive();
    } else {
      if (this.isSelectedElementEdge || this.isSelectedElementVertex) {
        if (this._selectedElement === edge) {
          this._selectedElement.setDisabled();
          this._selectedElement = null;
        } else {
          this._selectedElement.setDisabled();
          this._selectedElement = edge;
          this._selectedElement.setActive();
        }
      }
    }
  }

  addVertex(vertex: Vertex) {
    this._vertexs.push(vertex);
  }

  deleteVertex(id: number) {
    this._vertexs = this._vertexs.filter(v => v.id !== id);
  }

  deleteEdge(id: number) {
    this._edges = this._edges.filter(e => e.id !== id);
  }

  deleteEdgesConnectedToVertex(id: number) {
    this._edges.forEach(e => {
      if (e.v1 === id || e.v2 === id) {
        this.deleteEdge(e.id);
      }
    });
  }

  deleteVertexWoutEdges() {
    let hasEdges;  
    this._vertexs.forEach(v => {
      hasEdges = false;
      this._edges.forEach(e => {
        if (v.id === e.v1 || v.id === e.v2) {
          hasEdges = true;
        }
      });
      if (!hasEdges) {
        this.deleteVertex(v.id);
      }
    });
  }

  addEdge(edge: Edge) {
    this._edges.push(edge);
  }

  edgeExists(v1: number, v2: number): boolean {
    let result: boolean = false;
    this._edges.forEach(e => {
      if ((e.v1 === v1 && e.v2 === v2) || (e.v1 === v2 && e.v2 === v1)) {
        result = true;
      }
    });
    return result;
  }

  getVertexById(id: number): Vertex {
    let vertex = null;
    this._vertexs.forEach(v => {
      if (v.id === id) {
        vertex = v;
      }
    });
    return vertex;
  }

  getEdgeById(id: number): Edge {
    let edge = null;
    this.edges.forEach(e => {
      if (e.id === id) {
        edge = e;
      }
    });
    return edge;
  }

  setDraggedVertex(id: number) {
    this._selectedDraggedVertex = this.getVertexById(id);
  }

  setDraggedVertexNull() {
    this._selectedDraggedVertex = null;
  }

  moveDraggedVertex(e: MouseEvent) {
    if (this._selectedDraggedVertex) {
      const { x, y } = this.svgGraphicsService.parsePoint(e);
      this._selectedDraggedVertex.cx = x;
      this._selectedDraggedVertex.cy = y;
      this.updateEdgesCoords(this._selectedDraggedVertex);
    }
  }

  moveGraph(e: MouseEvent) {
    if (this._selectedDraggedVertex) {
      const { x, y } = this.svgGraphicsService.parsePoint(e);
      const dx = x - this._selectedDraggedVertex.cx;
      const dy = y - this._selectedDraggedVertex.cy;

      this._selectedDraggedVertex.cx = x;
      this._selectedDraggedVertex.cy = y;

      this._vertexs.forEach(v => {
        if (v !== this._selectedDraggedVertex) {
          v.cx += dx;
          v.cy += dy;
        }
        this.updateEdgesCoords(v);
      });
    }
  }

  updateEdgesCoords(vertex: Vertex) {
    this._edges.forEach(e => {
      if (e.v1 === vertex.id) {
        e.x1 = vertex.cx;
        e.y1 = vertex.cy;
      } else if (e.v2 === vertex.id) {
        e.x2 = vertex.cx;
        e.y2 = vertex.cy;
      }
    });
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

  get isSelectedElementVertex(): boolean {
    if (this._selectedElement instanceof Vertex) {
      return true;
    } else {
      return false;
    }
  }

  get isSelectedElementEdge(): boolean {
    if (this._selectedElement instanceof Edge) {
      return true;
    } else {
      return false;
    }
  }
}
