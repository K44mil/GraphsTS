import { Injectable } from '@angular/core';
import { Graph, Vertex, Edge, Loop } from '../_models';
import { GraphCalcService } from './graph-calc.service';
import { GraphDrawService } from './graph-draw.service';
import { SvgGraphicsService } from './svg-graphics.service';
import { Line } from '../_models/_svgModels';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private _graph: Graph;
  private _cLine: Line;
  private _adjacencyMatrix: number[][];
  private _incidenceMatrix: number[][];
  private _adjacencyLists: number[][];
  private _selectedElements: any[] = [];
  private _selectedDraggableVertex: Vertex;
  private _edgeStartVertex: Vertex;

  constructor(
    private graphCalcService: GraphCalcService,
    private graphDrawService: GraphDrawService,
    private svgGraphicsService: SvgGraphicsService
  ) { }

  private updateAdjacencyMatrix() {
    this._adjacencyMatrix = this.graphCalcService.createAdjacencyMatrix(this._graph.vertices, this._graph.edges, this._graph.loops, this._graph.isDigraph);
  }

  private updateIncidenceMatrix() {
    this._incidenceMatrix = this.graphCalcService.createIncidenceMatrix(this._graph.vertices, this._graph.edges, this._graph.loops, this._graph.isDigraph);
  }

  private updateAdjacencyLists() {
    this._adjacencyLists = this.graphCalcService.createAdjacencyLists(this._graph.vertices, this._graph.edges, this._graph.loops, this._graph.isDigraph);
  }

  handleBoardEvent(e: any, mode: number) {
    if (e instanceof MouseEvent) {
      switch (mode) {
        case 0:
          this.onClickBoardMode_0(e);
          break;
      }
    }
  }

  handleVertexEvent(e: MouseEvent, id: number, mode: number) {
    switch (mode) {
      case 0:
        if (e.type === 'click')
          this.onClickVertexMode_0(id);
        else if (e.type === 'dblclick')
          this.onDblclickVertexMode_0(id);
        else if (e.type === 'mousedown')
          this.onMouseDownVertexMode_0(id);
        break;
    }
  }

  handleEdgeEvent(e: any, mode: number) {
    if (typeof(e) === 'number') {
      switch (mode) {
        case 0:
          this.onClickEdgeMode_0(e);
          break;
      }
    }
  }

  handleLoopEvent(e: any, mode: number) {
    if (typeof(e) === 'number') {
      switch (mode) {
        case 0:
          this.onClickLoopMode_0(e);
          break;
      }
    }
  }

  private unselectAllElements() {
    this._selectedElements.forEach(e => {
      e.setDisabled();
    });
    this._selectedElements = [];
  }

  // Events
  // Create new vertex or unselect current selected elements if selected
  private onClickBoardMode_0(e: MouseEvent) {
    if (e.target instanceof SVGSVGElement) {
      if (this._selectedElements !== []) {
        this.unselectAllElements();
      } else {
        const { x, y } = this.svgGraphicsService.parsePoint(e);
        const id = this._graph.vertices.length ?  this._graph.vertices.length : 0;
        const vertex = new Vertex(id, x, y, 15);
        this._graph.vertices.push(vertex);
      }
    }
  }

  // Select vertex and unselect current selected elements
  private onClickVertexMode_0(id: number) {
    const vertex = this._graph.getVertexById(id);
    if (this.isOnlyOneSelectedElement) {
      if (this.isFirstSelectedElementVertex)
        if (this.firstSelectedElement.id === vertex.id) {
          this.firstSelectedElement.setDisabled();
          this._selectedElements = [];
        }
    } else if (this._selectedElements !== []) {
      this.unselectAllElements();
      vertex.setActive();
      this._selectedElements.push(vertex);
    } else {
      vertex.setActive();
      this._selectedElements.push(vertex);
    }
  }

  // Select edge and unselect current selected elements
  private onClickEdgeMode_0(id: number) {
    const edge = this._graph.getEdgeById(id);
    if (this.isOnlyOneSelectedElement) {
      if (this.isFirsSelectedElementEdge)
        if (this.firstSelectedElement.id === edge.id) {
          this.firstSelectedElement.setDisabled();
          this._selectedElements = [];
        }
    } else if (this._selectedElements !== []) {
      this.unselectAllElements();
      edge.setActive();
      this._selectedElements.push(edge);
    } else {
      edge.setActive();
      this._selectedElements.push(edge);
    }
  }

  // Select loop and unselect current selected elements
  private onClickLoopMode_0(id: number) {
    const loop = this._graph.getLoopById(id);
    if (this.isOnlyOneSelectedElement) {
      if (this.isFirsSelectedElementLoop)
        if (this.firstSelectedElement.id === loop.id) {
          this.firstSelectedElement.setDisabled();
          this._selectedElements = [];
        }
    } else if (this._selectedElements !== []) {
      this.unselectAllElements();
      loop.setActive();
      this._selectedElements.push(loop);
    } else {
      loop.setActive();
      this._selectedElements.push(loop);
    }
  }

  // create new loop
  private onDblclickVertexMode_0(id: number) {
    if (!this._graph.getLoopByVertexId(id)) {
      const v = this._graph.getVertexById(id);
      const loopId = this._graph.loops.length ? this._graph.loops.length : 0;
      const loop = new Loop(loopId, id, v.cx + v.r, v.cy + v.r, v.r);
      this._graph.loops.push(loop); 
    }
  }

  // Create line from getVertexById(id) to mouse pointer, and select this element
  private onMouseDownVertexMode_0(id: number) {
    this._edgeStartVertex = this._graph.getVertexById(id);
    this._cLine = new Line(0,
                           this._edgeStartVertex.cx,
                           this._edgeStartVertex.cy,
                           this._edgeStartVertex.cx,
                           this._edgeStartVertex.cy,
                           'blue',
                           5
                          );
  }

  // Create new edge from startVertex to this vertex
  private onMouseUpVertexMode_0(id: number) {
    const vertex = this._graph.getVertexById(id);
    if (this._edgeStartVertex && this._cLine) {
      if (this._edgeStartVertex.id === vertex.id) {
        this._cLine = null;
        this._edgeStartVertex = null;
      } else {
        if (!this._graph.getEdgeByVerticesIds(this._edgeStartVertex.id, vertex.id)) {
          // TODO
        }
      }
    }
  }



  // Getters
  get graph(): Graph {
    return this._graph;
  }

  get cLine(): Line {
    return this._cLine;
  }

  private get isFirstSelectedElementVertex(): boolean {
    if (this._selectedElements[0] instanceof Vertex)
      return true;
    else
      return false;
  }

  private get isFirsSelectedElementEdge(): boolean {
    if (this._selectedElements[0] instanceof Edge)
      return true;
    else
      return false;
  }

  private get isFirsSelectedElementLoop(): boolean {
    if (this._selectedElements[0] instanceof Loop)
      return true;
    else
      return false;
  }

  private get isOnlyOneSelectedElement(): boolean {
    if (this._selectedElements.length === 1)
      return true;
    else
      return false;
  }

  private get firstSelectedElement(): any {
    if (this._selectedElements !== [])
      return this._selectedElements[0];
  }

  // private _graph: Graph;
  // private _vertices: Vertex[];
  // private _edges: Edge[];
  // private _selectedElement: any;
  // private _selectedDraggedVertex: Vertex;

  // private _adjacencyMatrix: number[][];
  // private _incidenceMatrix: number[][];
  // private _adjacencyLists: number[][];

  // private _lineGraphvertices: Vertex[];
  // private _lineGraphEdges: Edge[];

  // private _pathStartVertex: Vertex;
  // private _pathEndVertex: Vertex;

  // private _bfsTreeRoot: Vertex;
  
  // constructor(
  //   private svgGraphicsService: SvgGraphicsService
  // ) { }

  // initNewGraph() {
  //   const savedGraphs = JSON.parse(localStorage.getItem('graphs')) || [];
  //   const newGraphId = savedGraphs.length ? Math.max(...savedGraphs.map(x => x.id)) + 1 : 1;
  //   this._graph = new Graph(newGraphId);
  //   this._vertices = [];
  //   this._edges = [];
  //   this._adjacencyMatrix = [];
  //   this._incidenceMatrix = [];
  //   this._adjacencyLists = [];
  //   this._pathStartVertex = null;
  //   this._pathEndVertex = null;
  //   this._bfsTreeRoot = null;
  // }

  // removeCurrentGraph() {
  //   this._graph = undefined;
  //   this._vertices = [];
  //   this._edges = [];
  //   this._adjacencyMatrix = [];
  //   this._incidenceMatrix = [];
  //   this._adjacencyLists = [];
  //   this._pathStartVertex = null;
  //   this._pathEndVertex = null;
  //   this._bfsTreeRoot = null;
  // }

  // removeSelectedElements() {
  //   if (this._selectedElement) {
  //     if (this.isSelectedElementVertex) {
  //       this.deleteEdgesConnectedToVertex(this._selectedElement.id);         
  //       this.deleteVertex(this._selectedElement.id);            
  //       this._selectedElement.setDisabled();
  //       this._selectedElement = null;
  //     } else if (this.isSelectedElementEdge) {
  //       this.deleteEdge(this._selectedElement.id);
  //       this._selectedElement.setDisabled();
  //       this._selectedElement = null;
  //     }
  //   }
  // }

  // addNewVertex(e: MouseEvent) {
  //   if (e.target instanceof SVGSVGElement) {
  //     const { x, y } = this.svgGraphicsService.parsePoint(e);
  //     const newVertexId = this._vertices.length ?  this._vertices.length : 0;
  //     const vertex = new Vertex(newVertexId, x, y, 15);
  //     this.addVertex(vertex);
  //   }
  // }

  // addNewEdge(v1: Vertex, v2: Vertex) {
  //   if (!this.edgeExists(v1.id, v2.id)) {
  //     const newEdgeId = this._edges.length ? this._edges.length : 0;
  //     const edge = new Edge(newEdgeId, v1.id, v2.id, v1.cx, v1.cy, v2.cx, v2.cy);
  //     this.addEdge(edge);
  //   }
  // }

  // onClickVertexMode_1(id: number) {
  //   this.setNullPathvertices();
  //   const vertex = this.getVertexById(id);
  //   if (this.isSelectedElementVertex) {
  //     if (this._selectedElement === vertex) {
  //       this._selectedElement.setDisabled();
  //       this.setAllConnectedEdgesUnhighlighted(this._selectedElement);
  //       this._selectedElement = null;
  //     } else {
  //       this.addNewEdge(this._selectedElement, vertex);
  //       this._selectedElement.setDisabled();
  //       this.setAllConnectedEdgesUnhighlighted(this._selectedElement);
  //       this._selectedElement = null;
  //     }
  //   } else if (this.isSelectedElementEdge) {
  //     this._selectedElement.setDisabled();
  //     this._selectedElement = vertex;
  //     this._selectedElement.setActive();
  //     this.setAllConnectedEdgesHighlighted(this._selectedElement);
  //   } else {
  //     this.clearAllColors();
  //     this._selectedElement = vertex;
  //     this._selectedElement.setActive();
  //     this.setAllConnectedEdgesHighlighted(this._selectedElement);
  //   }
  // }

  // onClickVertexMode_3(id: number) {
  //   if (this._selectedElement) {   
  //     if (this.isSelectedElementVertex)
  //       this.setAllConnectedEdgesUnhighlighted(this._selectedElement);
  //     this._selectedElement.setDisabled();
  //     this._selectedElement = null;
  //   }
  //   if (!this._pathStartVertex) {
  //     this.clearAllColors();
  //     this._pathStartVertex = this.getVertexById(id);
  //     this._pathStartVertex.setPathStartHighlight();
  //   } else {
  //     if (this._pathStartVertex === this.getVertexById(id)) {
  //       this.setAllEdgesUnhighlighted();
  //       this._pathStartVertex.setDisabled();
  //       this._pathStartVertex = null;
  //       if (this._pathEndVertex) {
  //         this._pathEndVertex.setDisabled();
  //         this._pathEndVertex = null;
  //       }
  //     } else {
  //       if (!this._pathEndVertex) {
  //         this._pathEndVertex = this.getVertexById(id);
  //         this._pathEndVertex.setPathEndHighlight();
  //         console.log(this.calcAnyPath());
  //         this.setAllEdgesUnhighlighted();
  //         this.setPathHighlighted(this.calcAnyPath());
  //       } else {
  //         if (this._pathEndVertex === this.getVertexById(id)) {
  //           this._pathEndVertex.setDisabled();
  //           this._pathEndVertex = null;
  //           this.setAllEdgesUnhighlighted();
  //         } else {
  //           this._pathEndVertex.setDisabled();
  //           this._pathEndVertex = this.getVertexById(id);
  //           this._pathEndVertex.setPathEndHighlight();
  //           console.log(this.calcAnyPath());
  //           this.setAllEdgesUnhighlighted();
  //           this.setPathHighlighted(this.calcAnyPath());
  //         }  
  //       }
  //     }
  //   }
  // }

  // onClickVertexMode_5(id) {
  //   this.clearAllColors();
  //   if (!this._bfsTreeRoot) {
  //     this._bfsTreeRoot = this.getVertexById(id);
  //     // calculate and color tree
  //     // console.log(this.calcBreadthFirstSpanningTree());
  //     this.colorBredthFirstSpanningTree(this.calcBreadthFirstSpanningTree());
  //   } else {
  //     if (this._bfsTreeRoot === this.getVertexById(id)) {
  //       this._bfsTreeRoot = null;
  //     } else {
  //       this._bfsTreeRoot = this.getVertexById(id);
  //       // calculate and color tree
  //       // console.log(this.calcBreadthFirstSpanningTree());
  //       this.colorBredthFirstSpanningTree(this.calcBreadthFirstSpanningTree());
  //     }
  //   }
  // }

  // setNullPathvertices() {
  //   if (this._pathStartVertex) {
  //     this._pathStartVertex.setDisabled();
  //     this._pathStartVertex = null;
  //   }
  //   if (this._pathEndVertex) {
  //     this._pathEndVertex.setDisabled();
  //     this._pathEndVertex = null;
  //   }
  // }

  // setAllConnectedEdgesHighlighted(vertex: Vertex) {
  //   this._edges.forEach(e => {
  //     if (e.v1 === vertex.id || e.v2 === vertex.id) {
  //       e.setHighlighted();
  //     }
  //   });
  // }

  // setAllConnectedEdgesUnhighlighted(vertex: Vertex) {
  //   this._edges.forEach(e => {
  //     if (e.v1 === vertex.id || e.v2 === vertex.id) {
  //       e.setUnhighlighted();
  //     }
  //   });
  // }

  // onClickEdge(id: number) {
  //   this.clearAllColors();
  //   this.setNullPathvertices();
  //   const edge = this.getEdgeById(id);
  //   if (!this._selectedElement) {
  //     this._selectedElement = edge;
  //     this._selectedElement.setActive();
  //   } else {
  //     if (this.isSelectedElementEdge || this.isSelectedElementVertex) {
  //       if (this._selectedElement === edge) {
  //         this._selectedElement.setDisabled();
  //         this._selectedElement = null;
  //       } else {
  //         this._selectedElement.setDisabled();
  //         this.setAllConnectedEdgesUnhighlighted(this._selectedElement);
  //         this._selectedElement = edge;
  //         this._selectedElement.setActive();
  //       }
  //     }
  //   }
  // }

  // addVertex(vertex: Vertex) {
  //   this._vertices.push(vertex);
  // }

  // deleteVertex(id: number) {
  //   this._vertices = this._vertices.filter(v => v.id !== id);
  //   this.updateverticesIds();
  // }

  // deleteEdge(id: number) {
  //   this._edges = this._edges.filter(e => e.id !== id);
  //   this.updateEdgesIds();
  // }

  // deleteEdgesConnectedToVertex(id: number) {
  //   this._edges.forEach(e => {
  //     if (e.v1 === id || e.v2 === id) {
  //       this.deleteEdge(e.id);
  //     }
  //   });
  // }

  // deleteVertexWoutEdges() {
  //   let hasEdges;  
  //   this._vertices.forEach(v => {
  //     hasEdges = false;
  //     this._edges.forEach(e => {
  //       if (v.id === e.v1 || v.id === e.v2) {
  //         hasEdges = true;
  //       }
  //     });
  //     if (!hasEdges) {
  //       this.deleteVertex(v.id);
  //     }
  //   });
  // }

  // addEdge(edge: Edge) {
  //   this._edges.push(edge);
  // }

  // edgeExists(v1: number, v2: number): boolean {
  //   let result: boolean = false;
  //   this._edges.forEach(e => {
  //     if ((e.v1 === v1 && e.v2 === v2) || (e.v1 === v2 && e.v2 === v1)) {
  //       result = true;
  //     }
  //   });
  //   return result;
  // }

  // lineGraphEdgeExists(v1: number, v2: number): boolean {
  //   let result: boolean = false;
  //   this._lineGraphEdges.forEach(e => {
  //     if ((e.v1 === v1 && e.v2 === v2) || (e.v1 === v2 && e.v2 === v1)) {
  //       result = true;
  //     }
  //   });
  //   return result;
  // }

  // getVertexById(id: number): Vertex {
  //   let vertex = null;
  //   this._vertices.forEach(v => {
  //     if (v.id === id) {
  //       vertex = v;
  //     }
  //   });
  //   return vertex;
  // }

  // getEdgeById(id: number): Edge {
  //   let edge = null;
  //   this.edges.forEach(e => {
  //     if (e.id === id) {
  //       edge = e;
  //     }
  //   });
  //   return edge;
  // }

  // setDraggedVertex(id: number) {
  //   this._selectedDraggedVertex = this.getVertexById(id);
  // }

  // setDraggedVertexNull() {
  //   this._selectedDraggedVertex = null;
  // }

  // moveDraggedVertex(e: MouseEvent) {
  //   if (this._selectedDraggedVertex) {
  //     const { x, y } = this.svgGraphicsService.parsePoint(e);
  //     this._selectedDraggedVertex.cx = x;
  //     this._selectedDraggedVertex.cy = y;
  //     this.updateEdgesCoords(this._selectedDraggedVertex);
  //   }
  // }

  // moveGraph(e: MouseEvent) {
  //   if (this._selectedDraggedVertex) {
  //     const { x, y } = this.svgGraphicsService.parsePoint(e);
  //     const dx = x - this._selectedDraggedVertex.cx;
  //     const dy = y - this._selectedDraggedVertex.cy;

  //     this._selectedDraggedVertex.cx = x;
  //     this._selectedDraggedVertex.cy = y;

  //     this._vertices.forEach(v => {
  //       if (v !== this._selectedDraggedVertex) {
  //         v.cx += dx;
  //         v.cy += dy;
  //       }
  //       this.updateEdgesCoords(v);
  //     });
  //   }
  // }

  // moveConnectedComponent(e) {
  //   const cComponentsArray: number[] = this.calcConnectedComponents();
  //   if (this._selectedDraggedVertex) {
  //     const dVertexComponentNumber = cComponentsArray[this._selectedDraggedVertex.id];
  //     const { x, y } = this.svgGraphicsService.parsePoint(e);
  //     const dx = x - this._selectedDraggedVertex.cx;
  //     const dy = y - this._selectedDraggedVertex.cy;

  //     this._selectedDraggedVertex.cx = x;
  //     this._selectedDraggedVertex.cy = y;

  //     this._vertices.forEach(v => {
  //       if (v != this._selectedDraggedVertex) {
  //         if (cComponentsArray[v.id] === dVertexComponentNumber) {
  //           v.cx += dx;
  //           v.cy += dy;
  //         }
  //       }
  //       this.updateEdgesCoords(v);
  //     });
  //   }
  // }

  // updateEdgesCoords(vertex: Vertex) {
  //   this._edges.forEach(e => {
  //     if (e.v1 === vertex.id) {
  //       e.x1 = vertex.cx;
  //       e.y1 = vertex.cy;
  //     } else if (e.v2 === vertex.id) {
  //       e.x2 = vertex.cx;
  //       e.y2 = vertex.cy;
  //     }
  //   });
  // }

  // updateverticesIds() {
  //   let id = 0;
  //   this._vertices.forEach(v => {
  //     this.updateEdgesVertexId(v.id, id);
  //     v.id = id++;
  //   });
  // }

  // updateEdgesIds() {
  //   let id = 0;
  //   this._edges.forEach(e => {
  //     e.id = id++;
  //   });
  // }

  // updateEdgesVertexId(oldId: number, newId: number) {
  //   this._edges.forEach(e => {
  //     if (e.v1 === oldId) {
  //       e.v1 = newId;
  //     } else if (e.v2 === oldId) {
  //       e.v2 = newId;
  //     }
  //   });
  // }

  // createAdjacencyMatrix(vertices: Vertex[], edges: Edge[]) {
  //   let aMatrix: number[][] = [];
  //   for (let i = 0; i < vertices.length; i++) {
  //     aMatrix[i] = [];
  //     for (let j = 0; j < vertices.length; j++) {
  //       aMatrix[i][j] = 0;
  //     }
  //   }
  //   for (let i = 0; i < vertices.length; i++) {
  //     for (let j = 0; j < vertices.length; j++) {
  //       edges.forEach(e => {
  //         if ((e.v1 === i && e.v2 === j) || (e.v1 === j && e.v2 === i)) {
  //           aMatrix[i][j] = 1;
  //         }
  //       });
  //     }
  //   }
  //   return aMatrix;
  // }

  // updateAdjacencyMatrix() {
  //   this._adjacencyMatrix = this.createAdjacencyMatrix(this._vertices, this._edges);
  // }

  // createIncidenceMatrix(vertices: Vertex[], edges: Edge[]) {
  //   let iMatrix: number[][] = [];
  //   for (let i = 0; i < vertices.length; i++) {
  //     iMatrix[i] = [];
  //     for (let j = 0; j < edges.length; j++) {
  //       iMatrix[i][j] = 0;
  //     }
  //   }
  //   for (let i = 0; i < vertices.length; i++) {
  //     for (let j = 0; j < edges.length; j++) {
  //       if (edges[j].v1 === i || edges[j].v2 === i) {
  //         iMatrix[i][j] = 1;
  //       }
  //     }
  //   }
  //   return iMatrix;
  // }

  // updateIncidenceMatrix() {
  //   this._incidenceMatrix = this.createIncidenceMatrix(this._vertices, this._edges);
  // }

  // createAdjacencyLists(vertices: Vertex[], edges: Edge[]) {
  //   let aLists: number[][] = [];
  //   for (let i = 0; i < vertices.length; i++) {
  //     aLists[i] = [];
  //     for (let j = 0; j < edges.length; j++) {
  //       if (edges[j].v1 === i)
  //         aLists[i].push(edges[j].v2);
  //       else if (edges[j].v2 === i)
  //         aLists[i].push(edges[j].v1);
  //     }
  //   }
  //   return aLists;
  // }

  // updateAdjacencyLists() {
  //   this._adjacencyLists = this.createAdjacencyLists(this._vertices, this._edges);
  // }

  // createLineGraph() {
  //   this._lineGraphvertices = [];
  //   this._lineGraphEdges = [];
  //   this.updateAdjacencyMatrix();

  //   for (let i = 0; i < this._edges.length; i++) {
  //     const e = this._edges[i]; 
  //     this._lineGraphvertices.push(new Vertex(i, (e.x1 + e.x2) / 2, (e.y1 + e.y2) / 2, 15));
  //   }

  //   let edgeId = 0;
  //   for (let v = 0; v < this._vertices.length; v++) {
  //     for (let u = 0; u < this._vertices.length; u++) {
  //       if (this._adjacencyMatrix[v][u] === 1) {
  //         const index_vu = this.getEdgeIdByverticesIds(v, u);
  //         // console.log('%c' + v + ' - ' + u, 'color: blue'); 
  //         for (let w = 0; w < this._vertices.length; w++) {
  //           if (this._adjacencyMatrix[u][w] === 1) {
  //             if (w === v)
  //               continue;
  //             // console.log('%c' + u + ' - ' + w, 'color: green');
  //             const index_uw = this.getEdgeIdByverticesIds(u, w);
  //             // console.log('%c(' + index_vu + ' - ' + index_uw + ')', 'color: red');
  //             let v1 = this._lineGraphvertices[index_vu];
  //             let v2 = this._lineGraphvertices[index_uw];
  //             // console.log('%c(' + v1.id + ' - ' + v2.id + ')', 'color: yellow');
  //             if (!(this.lineGraphEdgeExists(v1.id, v2.id) || this.lineGraphEdgeExists(v2.id, v1.id)))
  //               this._lineGraphEdges.push(new Edge(edgeId++, v1.id, v2.id, v1.cx, v1.cy, v2.cx, v2.cy));         
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // setLineGraphActive() {
  //   this.initNewGraph();
  //   this._vertices = this._lineGraphvertices;
  //   this._edges = this._lineGraphEdges;
  // }

  // getEdgeIdByverticesIds(v1_id: number, v2_id: number): number {
  //   let result: number = null;
  //   this._edges.forEach(e => {
  //     if ((e.v1 === v1_id && e.v2 === v2_id || e.v1 === v2_id && e.v2 === v1_id)) {
  //       result = e.id;
  //     }
  //   });
  //   return result;
  // }

  // getAllConnectedEdgesByVertexId(v_id: number): Edge[] {
  //   let connectedEdges: Edge[] = [];
  //   this._edges.forEach(e => {
  //     if (e.v1 === v_id || e.v2 === v_id)
  //       connectedEdges.push(e);
  //   });
  //   return connectedEdges;
  // }

  // calcGraphDegree(): number {
  //   this.updateAdjacencyMatrix();
  //   if (this._vertices.length > 0) {
  //     let verticesDegrees: number[] = new Array(this._vertices.length);
  //     verticesDegrees.fill(0, 0, this._vertices.length);
  //     for (let i = 0; i < this._vertices.length; i++) {
  //       for (let j = 0; j < this._vertices.length; j++) {
  //         if (i === j)
  //           continue;
  //         if (this._adjacencyMatrix[i][j] === 1)
  //           verticesDegrees[i]++;
  //       } 
  //     }
  //     return Math.max(...verticesDegrees);
  //   } else {
  //     return 0;
  //   }
  // }

  // // @@@ Calculate any path
  // private $_visited: boolean[];
  // private $_verticesStack: number[];

  // calcAnyPath() {
  //   this.$_visited = new Array(this._vertices.length);
  //   this.$_visited.fill(false, 0, this.$_visited.length);
  //   this.$_verticesStack = [];
  //   if (this.DFS(this._pathStartVertex.id) === false)
  //     return [];
  //   else
  //     return this.$_verticesStack;
  // }

  // private DFS(id: number): boolean {
  //   this.$_visited[id] = true;
  //   this.$_verticesStack.push(id);
  //   if (id === this._pathEndVertex.id) {
  //     return true;
  //   }
  //   for (let i = 0; i < this._vertices.length; i++) {
  //     if (i === id)
  //       continue;
  //     if (this._adjacencyMatrix[id][i] === 1) {
  //       if (this.$_visited[i] === true)
  //         continue;
  //       if (this.DFS(i) === true)
  //         return true;
  //     }
  //   }
  //   this.$_verticesStack.pop();
  //   return false;
  // }
  // // @@@

  // setPathHighlighted(path: number[]) {
  //   for (let i = 0; i < path.length - 1; i++) {
  //     const edgeId: number = this.getEdgeIdByverticesIds(path[i], path[i+1]);
  //     this._edges[edgeId].setHighlighted();
  //   }
  // }

  // setAllEdgesUnhighlighted() {
  //   this._edges.forEach(e => {
  //     e.setDisabled();
  //   });
  // }

  // // Check if graf is connected or not
  // isGraphConnected(): boolean {
  //   this.updateAdjacencyMatrix();
  //   let visited: boolean[] = new Array(this._vertices.length);
  //   let verticesStack: number[] = [];
  //   let countVisited = 0;
  //   visited.fill(false, 0, visited.length);
  //   verticesStack.push(0);
  //   visited[0] = true;
  //   while (verticesStack.length > 0) {
  //     let v = verticesStack[verticesStack.length-1];
  //     verticesStack.pop();
  //     countVisited++;
  //     for (let u = 0; u < this._vertices.length; u++) {
  //       if (u === v)
  //         continue;
  //       if (this._adjacencyMatrix[v][u] === 1) {
  //         if (visited[u] === true)
  //           continue;
  //           visited[u] = true;
  //           verticesStack.push(u);
  //       }
  //     }
  //   }
  //   if (countVisited === this._vertices.length)
  //     return true;
  //   return false;
  // }

  // calcConnectedComponents(): number[] {
  //   this.updateAdjacencyMatrix();
  //   let C: number[] = new Array(this._vertices.length);
  //   let verticesStack: number[] = [];
  //   let cComponentsCounter = 0;
  //   C.fill(0, 0, C.length);
  //   for (let i = 0; i < this._vertices.length; i++) {
  //     if (C[i] > 0)
  //       continue;
  //     cComponentsCounter++;
  //     verticesStack.push(i);
  //     C[i] = cComponentsCounter;
  //     while (verticesStack.length > 0) {
  //       let v = verticesStack[verticesStack.length - 1];
  //       verticesStack.pop()
  //       for (let u = 0; u < this._vertices.length; u++) {
  //           if (u === v)
  //             continue;
  //           if (this._adjacencyMatrix[v][u] === 1) {
  //             if (C[u] > 0)
  //               continue;
  //             verticesStack.push(u);
  //             C[u] = cComponentsCounter;
  //           }
  //       }
  //     }
  //   }
  //   return C;
  // }

  // private getRandomColor(): string {
  //   const colorR = Math.floor(Math.random() * (255 + 1));
  //   const colorG = Math.floor(Math.random() * (255 + 1));
  //   const colorB = Math.floor(Math.random() * (255 + 1));
  //   const randomColor = 'rgb(' + colorR.toString() + ', ' + colorG.toString() + ', ' + colorB.toString() + ')';
  //   return randomColor;
  // }

  // colorConnectedComponents(C: number[]) {
  //   this.clearAllColors();
  //   const onlyUnique = (value, index, self) => {
  //     return self.indexOf(value) === index;
  //   };
  //   const cUniqueValues: number[] = C.filter(onlyUnique);
  //   cUniqueValues.forEach((uv) => {
  //     const randomColor = this.getRandomColor();
  //     this._vertices.forEach(v => {
  //       if (C[v.id] === uv) {
  //         this._vertices[v.id].fill = randomColor;
  //         const connectedEdges: Edge[] = this.getAllConnectedEdgesByVertexId(v.id);
  //         if (connectedEdges.length > 0) {
  //           connectedEdges.forEach(e => {
  //             e.stroke = randomColor;
  //           });
  //         }
  //       }
  //     });
  //   });
  // }

  // clearAllColors() {
  //   this._vertices.forEach(v => {
  //     v.setDisabled();
  //   });
  //   this._edges.forEach(e => {
  //     e.setDisabled();
  //   });
  // }

  // calcBreadthFirstSpanningTree(): number[][] {
  //   this.updateAdjacencyMatrix();
  //   let visited: boolean[] = new Array(this._vertices.length);
  //   let T: number[][] = [];
  //   let Q: number[] = [];
  //   visited.fill(false, 0, visited.length);
  //   for (let i = 0; i < this._vertices.length; i++) {
  //     T[i] = [];
  //   }
  //   Q.push(-1); Q.push(this._bfsTreeRoot.id);
  //   visited[this._bfsTreeRoot.id] = true;
  //   while (Q.length > 0) {
  //     let v = Q[0]; Q.reverse(); Q.pop(); Q.reverse();
  //     let w = Q[0]; Q.reverse(); Q.pop(); Q.reverse();
  //     if (v > -1)
  //       T[v].push(w);
  //     for (let z = 0; z < this._vertices.length; z++) {
  //       if (z === w)
  //         continue;
  //       if (this._adjacencyMatrix[w][z] === 1) {
  //         if (visited[z] === true)
  //           continue;
  //         visited[z] = true;
  //         Q.push(w);
  //         Q.push(z);
  //       }
  //     }
  //   }
  //   return T;
  // }

  // colorBredthFirstSpanningTree(T: number[][]) {
  //   this.clearAllColors();
  //   this._bfsTreeRoot.fill = this.getRandomColor();
  //   const randomColor = this.getRandomColor();
  //   for (let i = 0; i < this._vertices.length; i++) {
  //     for (let j = 0; j < T[i].length; j++) {
  //       const edge = this._edges[this.getEdgeIdByverticesIds(i, T[i][j])];
  //       this.getVertexById(T[i][j]).fill = randomColor;
  //       edge.stroke = randomColor;
  //     }
  //   }
  // }
  
  // // Getters
  // get graph(): Graph {
  //   return this._graph;
  // }

  // get vertices(): Vertex[] {
  //   return this._vertices;
  // }

  // get edges(): Edge[] {
  //   return this._edges;
  // }

  // get adjacencyMatrix() {
  //   return this._adjacencyMatrix;
  // }

  // get incidenceMatrix() {
  //   return this._incidenceMatrix;
  // }

  // get adjacencyLists() {
  //   return this._adjacencyLists;
  // }

  
}
