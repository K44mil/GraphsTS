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

  private _adjacencyMatrix: number[][];
  private _incidenceMatrix: number[][];

  private _lineGraphVertexs: Vertex[];
  private _lineGraphEdges: Edge[];

  private _pathStartVertex: Vertex;
  private _pathEndVertex: Vertex;
  

  constructor(
    private svgGraphicsService: SvgGraphicsService
  ) { }

  initNewGraph() {
    const savedGraphs = JSON.parse(localStorage.getItem('graphs')) || [];
    const newGraphId = savedGraphs.length ? Math.max(...savedGraphs.map(x => x.id)) + 1 : 1;
    this._graph = new Graph(newGraphId);
    this._vertexs = [];
    this._edges = [];
    this._adjacencyMatrix = [];
    this._incidenceMatrix = [];
    this._pathStartVertex = null;
    this._pathEndVertex = null;
  }

  removeCurrentGraph() {
    this._graph = undefined;
    this._vertexs = [];
    this._edges = [];
    this._adjacencyMatrix = [];
    this._incidenceMatrix = [];
    this._pathStartVertex = null;
    this._pathEndVertex = null;
  }

  removeSelectedElements() {
    if (this._selectedElement) {
      if (this.isSelectedElementVertex) {
        this.deleteEdgesConnectedToVertex(this._selectedElement.id);         
        this.deleteVertex(this._selectedElement.id);            
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
      const newVertexId = this._vertexs.length ?  this._vertexs.length : 0;
      const vertex = new Vertex(newVertexId, x, y, 15);
      this.addVertex(vertex);
    }
  }

  addNewEdge(v1: Vertex, v2: Vertex) {
    if (!this.edgeExists(v1.id, v2.id)) {
      const newEdgeId = this._edges.length ? this._edges.length : 0;
      const edge = new Edge(newEdgeId, v1.id, v2.id, v1.cx, v1.cy, v2.cx, v2.cy);
      this.addEdge(edge);
    }
  }

  onClickVertexMode_1(id: number) {
    this.setNullPathVertexs();
    const vertex = this.getVertexById(id);
    if (this.isSelectedElementVertex) {
      if (this._selectedElement === vertex) {
        this._selectedElement.setDisabled();
        this.setAllConnectedEdgesUnhighlighted(this._selectedElement);
        this._selectedElement = null;
      } else {
        this.addNewEdge(this._selectedElement, vertex);
        this._selectedElement.setDisabled();
        this.setAllConnectedEdgesUnhighlighted(this._selectedElement);
        this._selectedElement = null;
      }
    } else if (this.isSelectedElementEdge) {
      this._selectedElement.setDisabled();
      this._selectedElement = vertex;
      this._selectedElement.setActive();
      this.setAllConnectedEdgesHighlighted(this._selectedElement);
    } else {
      this.setAllEdgesUnhighlighted();
      this._selectedElement = vertex;
      this._selectedElement.setActive();
      this.setAllConnectedEdgesHighlighted(this._selectedElement);
    }
  }

  onClickVertexMode_3(id: number) {
    if (this._selectedElement) {   
      if (this.isSelectedElementVertex)
        this.setAllConnectedEdgesUnhighlighted(this._selectedElement);
      this._selectedElement.setDisabled();
      this._selectedElement = null;
    }
    if (!this._pathStartVertex) {
      this._pathStartVertex = this.getVertexById(id);
      this._pathStartVertex.setPathStartHighlight();
    } else {
      if (this._pathStartVertex === this.getVertexById(id)) {
        this.setAllEdgesUnhighlighted();
        this._pathStartVertex.setDisabled();
        this._pathStartVertex = null;
        if (this._pathEndVertex) {
          this._pathEndVertex.setDisabled();
          this._pathEndVertex = null;
        }
      } else {
        if (!this._pathEndVertex) {
          this._pathEndVertex = this.getVertexById(id);
          this._pathEndVertex.setPathEndHighlight();
          console.log(this.calcAnyPath());
          this.setAllEdgesUnhighlighted();
          this.setPathHighlighted(this.calcAnyPath());
        } else {
          if (this._pathEndVertex === this.getVertexById(id)) {
            this._pathEndVertex.setDisabled();
            this._pathEndVertex = null;
            this.setAllEdgesUnhighlighted();
          } else {
            this._pathEndVertex.setDisabled();
            this._pathEndVertex = this.getVertexById(id);
            this._pathEndVertex.setPathEndHighlight();
            console.log(this.calcAnyPath());
            this.setAllEdgesUnhighlighted();
            this.setPathHighlighted(this.calcAnyPath());
          }  
        }
      }
    }
  }

  setNullPathVertexs() {
    if (this._pathStartVertex) {
      this._pathStartVertex.setDisabled();
      this._pathStartVertex = null;
    }
    if (this._pathEndVertex) {
      this._pathEndVertex.setDisabled();
      this._pathEndVertex = null;
    }
  }

  setAllConnectedEdgesHighlighted(vertex: Vertex) {
    this._edges.forEach(e => {
      if (e.v1 === vertex.id || e.v2 === vertex.id) {
        e.setHighlighted();
      }
    });
  }

  setAllConnectedEdgesUnhighlighted(vertex: Vertex) {
    this._edges.forEach(e => {
      if (e.v1 === vertex.id || e.v2 === vertex.id) {
        e.setUnhighlighted();
      }
    });
  }

  onClickEdge(id: number) {
    this.setAllEdgesUnhighlighted();
    this.setNullPathVertexs();
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
          this.setAllConnectedEdgesUnhighlighted(this._selectedElement);
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
    this.updateVertexsIds();
  }

  deleteEdge(id: number) {
    this._edges = this._edges.filter(e => e.id !== id);
    this.updateEdgesIds();
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

  lineGraphEdgeExists(v1: number, v2: number): boolean {
    let result: boolean = false;
    this._lineGraphEdges.forEach(e => {
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

  updateVertexsIds() {
    let id = 0;
    this._vertexs.forEach(v => {
      this.updateEdgesVertexId(v.id, id);
      v.id = id++;
    });
  }

  updateEdgesIds() {
    let id = 0;
    this._edges.forEach(e => {
      e.id = id++;
    });
  }

  updateEdgesVertexId(oldId: number, newId: number) {
    this._edges.forEach(e => {
      if (e.v1 === oldId) {
        e.v1 = newId;
      } else if (e.v2 === oldId) {
        e.v2 = newId;
      }
    });
  }

  createAdjacencyMatrix(vertexs: Vertex[], edges: Edge[]) {
    let aMatrix: number[][] = [];
    for (let i = 0; i < vertexs.length; i++) {
      aMatrix[i] = [];
      for (let j = 0; j < vertexs.length; j++) {
        aMatrix[i][j] = 0;
      }
    }
    for (let i = 0; i < vertexs.length; i++) {
      for (let j = 0; j < vertexs.length; j++) {
        edges.forEach(e => {
          if ((e.v1 === i && e.v2 === j) || (e.v1 === j && e.v2 === i)) {
            aMatrix[i][j] = 1;
          }
        });
      }
    }
    return aMatrix;
  }

  updateAdjacencyMatrix() {
    this._adjacencyMatrix = this.createAdjacencyMatrix(this._vertexs, this._edges);
  }

  createIncidenceMatrix(vertexs: Vertex[], edges: Edge[]) {
    let iMatrix: number[][] = [];
    for (let i = 0; i < vertexs.length; i++) {
      iMatrix[i] = [];
      for (let j = 0; j < edges.length; j++) {
        iMatrix[i][j] = 0;
      }
    }
    for (let i = 0; i < vertexs.length; i++) {
      for (let j = 0; j < edges.length; j++) {
        if (edges[j].v1 === i || edges[j].v2 === i) {
          iMatrix[i][j] = 1;
        }
      }
    }
    return iMatrix;
  }

  updateIncidenceMatrix() {
    this._incidenceMatrix = this.createIncidenceMatrix(this._vertexs, this._edges);
  }

  createLineGraph() {
    this._lineGraphVertexs = [];
    this._lineGraphEdges = [];
    this.updateAdjacencyMatrix();

    for (let i = 0; i < this._edges.length; i++) {
      const e = this._edges[i]; 
      this._lineGraphVertexs.push(new Vertex(i, (e.x1 + e.x2) / 2, (e.y1 + e.y2) / 2, 15));
    }

    let edgeId = 0;
    for (let v = 0; v < this._vertexs.length; v++) {
      for (let u = 0; u < this._vertexs.length; u++) {
        if (this._adjacencyMatrix[v][u] === 1) {
          const index_vu = this.getEdgeIdByVertexsIds(v, u);
          // console.log('%c' + v + ' - ' + u, 'color: blue'); 
          for (let w = 0; w < this._vertexs.length; w++) {
            if (this._adjacencyMatrix[u][w] === 1) {
              if (w === v)
                continue;
              // console.log('%c' + u + ' - ' + w, 'color: green');
              const index_uw = this.getEdgeIdByVertexsIds(u, w);
              // console.log('%c(' + index_vu + ' - ' + index_uw + ')', 'color: red');
              let v1 = this._lineGraphVertexs[index_vu];
              let v2 = this._lineGraphVertexs[index_uw];
              // console.log('%c(' + v1.id + ' - ' + v2.id + ')', 'color: yellow');
              if (!(this.lineGraphEdgeExists(v1.id, v2.id) || this.lineGraphEdgeExists(v2.id, v1.id)))
                this._lineGraphEdges.push(new Edge(edgeId++, v1.id, v2.id, v1.cx, v1.cy, v2.cx, v2.cy));         
            }
          }
        }
      }
    }
  }

  setLineGraphActive() {
    this.initNewGraph();
    this._vertexs = this._lineGraphVertexs;
    this._edges = this._lineGraphEdges;
  }

  getEdgeIdByVertexsIds(v1_id: number, v2_id: number): number {
    let result: number = null;
    this._edges.forEach(e => {
      if ((e.v1 === v1_id && e.v2 === v2_id || e.v1 === v2_id && e.v2 === v1_id)) {
        result = e.id;
      }
    });
    return result;
  }

  getAllConnectedEdgesByVertexId(v_id: number): Edge[] {
    let connectedEdges: Edge[] = [];
    this._edges.forEach(e => {
      if (e.v1 === v_id || e.v2 === v_id)
        connectedEdges.push(e);
    });
    return connectedEdges;
  }

  calcGraphDegree(): number {
    this.updateAdjacencyMatrix();
    if (this._vertexs.length > 0) {
      let vertexsDegrees: number[] = new Array(this._vertexs.length);
      vertexsDegrees.fill(0, 0, this._vertexs.length);
      for (let i = 0; i < this._vertexs.length; i++) {
        for (let j = 0; j < this._vertexs.length; j++) {
          if (i === j)
            continue;
          if (this._adjacencyMatrix[i][j] === 1)
            vertexsDegrees[i]++;
        } 
      }
      return Math.max(...vertexsDegrees);
    } else {
      return 0;
    }
  }

  // @@@ Calculate any path
  private $_visited: boolean[];
  private $_vertexsStack: number[];

  calcAnyPath() {
    this.$_visited = new Array(this._vertexs.length);
    this.$_visited.fill(false, 0, this.$_visited.length);
    this.$_vertexsStack = [];
    if (this.DFS(this._pathStartVertex.id) === false)
      return [];
    else
      return this.$_vertexsStack;
  }

  private DFS(id: number): boolean {
    this.$_visited[id] = true;
    this.$_vertexsStack.push(id);
    if (id === this._pathEndVertex.id) {
      return true;
    }
    for (let i = 0; i < this._vertexs.length; i++) {
      if (i === id)
        continue;
      if (this._adjacencyMatrix[id][i] === 1) {
        if (this.$_visited[i] === true)
          continue;
        if (this.DFS(i) === true)
          return true;
      }
    }
    this.$_vertexsStack.pop();
    return false;
  }
  // @@@

  setPathHighlighted(path: number[]) {
    for (let i = 0; i < path.length - 1; i++) {
      const edgeId: number = this.getEdgeIdByVertexsIds(path[i], path[i+1]);
      this._edges[edgeId].setHighlighted();
    }
  }

  setAllEdgesUnhighlighted() {
    this._edges.forEach(e => {
      e.setDisabled();
    });
  }

  // Check if graf is connected or not
  isGraphConnected(): boolean {
    this.updateAdjacencyMatrix();
    let visited: boolean[] = new Array(this._vertexs.length);
    let vertexsStack: number[] = [];
    let countVisited = 0;
    visited.fill(false, 0, visited.length);
    vertexsStack.push(0);
    visited[0] = true;
    while (vertexsStack.length > 0) {
      let v = vertexsStack[vertexsStack.length-1];
      vertexsStack.pop();
      countVisited++;
      for (let u = 0; u < this._vertexs.length; u++) {
        if (u === v)
          continue;
        if (this._adjacencyMatrix[v][u] === 1) {
          if (visited[u] === true)
            continue;
            visited[u] = true;
            vertexsStack.push(u);
        }
      }
    }
    if (countVisited === this._vertexs.length)
      return true;
    return false;
  }

  calcConnectedComponents(): number[] {
    this.updateAdjacencyMatrix();
    let C: number[] = new Array(this._vertexs.length);
    let vertexsStack: number[] = [];
    let cComponentsCounter = 0;
    C.fill(0, 0, C.length);
    for (let i = 0; i < this._vertexs.length; i++) {
      if (C[i] > 0)
        continue;
      cComponentsCounter++;
      vertexsStack.push(i);
      C[i] = cComponentsCounter;
      while (vertexsStack.length > 0) {
        let v = vertexsStack[vertexsStack.length - 1];
        vertexsStack.pop()
        for (let u = 0; u < this._vertexs.length; u++) {
            if (u === v)
              continue;
            if (this._adjacencyMatrix[v][u] === 1) {
              if (C[u] > 0)
                continue;
              vertexsStack.push(u);
              C[u] = cComponentsCounter;
            }
        }
      }
    }
    return C;
  }

  colorConnectedComponents(C: number[]) {
    this.clearAllColors();
    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    const cUniqueValues: number[] = C.filter(onlyUnique);
    cUniqueValues.forEach((uv) => {
      const colorR = Math.floor(Math.random() * (255 + 1));
      const colorG = Math.floor(Math.random() * (255 + 1));
      const colorB = Math.floor(Math.random() * (255 + 1));
      const randomColor = 'rgb(' + colorR.toString() + ', ' + colorG.toString() + ', ' + colorB.toString() + ')';
      this._vertexs.forEach(v => {
        if (C[v.id] === uv) {
          this._vertexs[v.id].fill = randomColor;
          const connectedEdges: Edge[] = this.getAllConnectedEdgesByVertexId(v.id);
          if (connectedEdges.length > 0) {
            connectedEdges.forEach(e => {
              e.stroke = randomColor;
            });
          }
        }
      });
    });
  }

  clearAllColors() {
    this._vertexs.forEach(v => {
      v.setDisabled();
    });
    this._edges.forEach(e => {
      e.setDisabled();
    });
  }

  
  // Getters
  get graph(): Graph {
    return this._graph;
  }

  get vertexs(): Vertex[] {
    return this._vertexs;
  }

  get edges(): Edge[] {
    return this._edges;
  }

  get adjacencyMatrix() {
    return this._adjacencyMatrix;
  }

  get incidenceMatrix() {
    return this._incidenceMatrix;
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
