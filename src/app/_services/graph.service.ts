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

  initNewGraph() {
    this._graph = new Graph(0);
  }

  private updateAdjacencyMatrix() {
    this._adjacencyMatrix = this.graphCalcService.createAdjacencyMatrix(this._graph);
  }

  private updateIncidenceMatrix() {
    this._incidenceMatrix = this.graphCalcService.createIncidenceMatrix(this._graph);
  }

  private updateAdjacencyLists() {
    this._adjacencyLists = this.graphCalcService.createAdjacencyLists(this._graph);
  }

  handleBoardEvent(e: any, mode: number) {
    if (e instanceof MouseEvent) {
      switch (mode) {
        case 0:
          if (e.type === 'click')
            this.onClickBoardMode_0(e);
          else if (e.type === 'dblclick')
            this.onDblclickBoardMode_0(e);
          else if (e.type === 'mousemove') {
            this.setDraggableVertexNull();
            this.onMouseMoveMode_0(e);
          }
          else if (e.type === 'mouseup')
            this.onMouseUpBoard(e);
          break;
        case 1:
          if (e.type === 'mousemove') {
            this._cLine = null;
            this.moveDraggableVertex(e);
          }
          else if (e.type === 'mouseup')
            this.setDraggableVertexNull();
          break;
        case 2:
          if (e.type === 'mousemove') {
            this._cLine = null;
            this.moveGraph(e);
          } else if (e.type === 'mouseup')
            this.setDraggableVertexNull();
          break;
        case 3:
          if (e.type === 'mousemove') {
            this._cLine = null;
            this.moveConnectedComponent(e);
          } else if (e.type === 'mouseup')
            this.setDraggableVertexNull();
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
        else if (e.type === 'mouseup')
          this.onMouseUpVertexMode_0(id);
        break;
      case 1:
        if (e.type === 'mousedown')
          this.onMouseDownVertexMode_1(id);
        break;
      case 2:
        if (e.type === 'mousedown')
          this.onMouseDownVertexMode_2(id);
        break;
      case 3:
        if (e.type === 'mousedown')
          this.onMouseDownVertexMode_3(id);
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
    if (e.target instanceof SVGSVGElement)
      if (this._selectedElements.length > 0)
        this.unselectAllElements();
  }

  // Select vertex and unselect current selected elements
  private onClickVertexMode_0(id: number) {
    const vertex = this._graph.getVertexById(id);
    if (this.isOnlyOneSelectedElement) {
      if (this.isFirstSelectedElementVertex) {
        if (this.firstSelectedElement.id === vertex.id) {
          this.firstSelectedElement.setDisabled();
          this._selectedElements = [];
        } else {
          this.firstSelectedElement.setDisabled();
          this._selectedElements.pop();
          vertex.setActive();
          this._selectedElements.push(vertex);
        }
      } else {
        this.firstSelectedElement.setDisabled();
        this._selectedElements.pop();
        vertex.setActive();
        this._selectedElements.push(vertex);
      }
    } else if (this._selectedElements.length > 0) {
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
      if (this.isFirsSelectedElementEdge) {
        if (this.firstSelectedElement.id === edge.id) {
          this.firstSelectedElement.setDisabled();
          this._selectedElements = [];
        } else {
          this.firstSelectedElement.setDisabled();
          this._selectedElements.pop();
          edge.setActive();
          this._selectedElements.push(edge);
        }
      } else {
        this.firstSelectedElement.setDisabled();
        this._selectedElements.pop();
        edge.setActive();
        this._selectedElements.push(edge);
      }
    } else if (this._selectedElements.length > 0) {
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
      if (this.isFirsSelectedElementLoop) {
        if (this.firstSelectedElement.id === loop.id) {
          this.firstSelectedElement.setDisabled();
          this._selectedElements = [];
        } else {
          this.firstSelectedElement.setDisabled();
          this._selectedElements.pop();
          loop.setActive();
          this._selectedElements.push(loop);
        }
      } else {
        this.firstSelectedElement.setDisabled();
        this._selectedElements.pop();
        loop.setActive();
        this._selectedElements.push(loop);
      }
    } else if (this._selectedElements.length > 0) {
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

  // create new vertex
  private onDblclickBoardMode_0(e) {
    if (e.target instanceof SVGSVGElement) {
      const { x, y } = this.svgGraphicsService.parsePoint(e);
      const id = this._graph.vertices.length ?  this._graph.vertices.length : 0;
      const vertex = new Vertex(id, x, y, 15);
      this._graph.vertices.push(vertex);
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
        if (this._graph.isDigraph) {
          // TODO
        } else {
          if (!(this._graph.getEdgeByVerticesIds(this._edgeStartVertex.id, vertex.id)
                || this._graph.getEdgeByVerticesIds(vertex.id, this._edgeStartVertex.id))) {
            this.addNewEdge(this._edgeStartVertex, vertex);
          }
        }
      }
    }
  }

  private addNewEdge(v1: Vertex, v2: Vertex) {
    const id = this._graph.edges.length ?  this._graph.edges.length : 0;
    const edge = new Edge(id, v1.id, v2.id, v1.cx, v1.cy, v2.cx, v2.cy);
    this._graph.edges.push(edge);
  }

  // move connecting line
  private onMouseMoveMode_0(e) {
    if (this._cLine) {
      const { x, y } = this.svgGraphicsService.parsePoint(e);
      this._cLine.x2 = x;
      this._cLine.y2 = y;
    }
  }

  // delete connecting line
  private onMouseUpBoard(e) {
    if (this._cLine) {
      this._cLine = null;
      this._edgeStartVertex = null;
    } 
  }

  deleteSelectedElements() {
    this._selectedElements.forEach(e => {
      if (e instanceof Edge)
        this._graph.deleteEdgeById(e.id);
      else if (e instanceof Vertex)
        this._graph.deleteVertexById(e.id);
      else if (e instanceof Loop)
        this._graph.deleteLoopById(e.id);
    });
    this._selectedElements = [];
  }

  private setDraggableVertex(id: number) {
    this._selectedDraggableVertex = this._graph.getVertexById(id);
  }

  private setDraggableVertexNull() {
    this._selectedDraggableVertex = null;
  }

  private moveDraggableVertex(e: MouseEvent) {
    if (this._selectedDraggableVertex) {
      const { x, y } = this.svgGraphicsService.parsePoint(e);
      this._selectedDraggableVertex.cx = x;
      this._selectedDraggableVertex.cy = y;
      this._graph.updateEdgesCoords(this._selectedDraggableVertex);
      this._graph.updateLoopsCoords(this._selectedDraggableVertex);
    }
  }

  private onMouseDownVertexMode_1(id) {
    this.setDraggableVertex(id);
  }

  private onMouseDownVertexMode_2(id) {
    this.setDraggableVertex(id);
  }

  private onMouseDownVertexMode_3(id) {
    this.setDraggableVertex(id);
  }

  private moveGraph(e: MouseEvent) {
    if (this._selectedDraggableVertex) {
      const { x, y } = this.svgGraphicsService.parsePoint(e);
      const dx = x - this._selectedDraggableVertex.cx;
      const dy = y - this._selectedDraggableVertex.cy;

      this._selectedDraggableVertex.cx = x;
      this._selectedDraggableVertex.cy = y;

      this._graph.vertices.forEach(v => {
        if (v !== this._selectedDraggableVertex) {
          v.cx += dx;
          v.cy += dy;
        }
        this._graph.updateEdgesCoords(v);
        this._graph.updateLoopsCoords(v);
      });
    }
  }

  private moveConnectedComponent(e) {
    const cComponentsArray: number[] = this.graphCalcService.calcConnectedComponents(this._graph);
    if (this._selectedDraggableVertex) {
      const dVertexComponentNumber = cComponentsArray[this._selectedDraggableVertex.id];
      const { x, y } = this.svgGraphicsService.parsePoint(e);
      const dx = x - this._selectedDraggableVertex.cx;
      const dy = y - this._selectedDraggableVertex.cy;

      this._selectedDraggableVertex.cx = x;
      this._selectedDraggableVertex.cy = y;

      this._graph.vertices.forEach(v => {
        if (v != this._selectedDraggableVertex) {
          if (cComponentsArray[v.id] === dVertexComponentNumber) {
            v.cx += dx;
            v.cy += dy;
          }
        }
        this._graph.updateEdgesCoords(v);
        this._graph.updateLoopsCoords(v);
      });
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

  // lineGraphEdgeExists(v1: number, v2: number): boolean {
  //   let result: boolean = false;
  //   this._lineGraphEdges.forEach(e => {
  //     if ((e.v1 === v1 && e.v2 === v2) || (e.v1 === v2 && e.v2 === v1)) {
  //       result = true;
  //     }
  //   });
  //   return result;
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
