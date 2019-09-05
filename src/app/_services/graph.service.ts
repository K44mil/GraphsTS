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
    this._graph = new Graph(0, new Array(0), new Array(0), new Array(0), '', false, false);
  }

  initNewDigraph() {
    this._graph = new Graph(0, new Array(0), new Array(0), new Array(0), '', true, false);
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
            else if (e.type === 'mousemove')
              this.onMouseMoveMode_0(e);
            else if (e.type === 'mouseup')
              this.onMouseUpBoardMode_0(e);
          break;
        case 1:
            if (e.type === 'mousemove')
              this.onMouseMoveMode_1(e);
            else if (e.type === 'mouseup')
              this.onMouseUpBoardMode_1(e);
          break;
        case 2:
          if (e.type === 'mousemove') 
            this.onMouseMoveMode_2(e);
          else if (e.type === 'mouseup')
            this.onMouseUpBoardMode_2(e);
          break;
        case 3:
          if (e.type === 'mousemove')
            this.onMouseMoveMode_3(e);
          else if (e.type === 'mouseup')
            this.onMouseUpBoardMode_3(e);
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

  // Events [ MODE 0 ]
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
          if (!this.graph.getEdgeByVerticesIds(this._edgeStartVertex.id, vertex.id)) {
            this.addNewEdge(this._edgeStartVertex, vertex);
          }
        } else {
          if (!(this._graph.getEdgeByVerticesIds(this._edgeStartVertex.id, vertex.id)
                || this._graph.getEdgeByVerticesIds(vertex.id, this._edgeStartVertex.id))) {
            this.addNewEdge(this._edgeStartVertex, vertex);
          }
        }
      }
    }
  }

  // move connecting line
  private onMouseMoveMode_0(e: MouseEvent) {
    this._selectedDraggableVertex = null;
    if (this._cLine) {
      const { x, y } = this.svgGraphicsService.parsePoint(e);
      this._cLine.x2 = x;
      this._cLine.y2 = y;
    }
  }

  // delete connecting line
  private onMouseUpBoardMode_0(e: MouseEvent) {
    if (this._cLine) {
      this._cLine = null;
      this._edgeStartVertex = null;
    } 
  }

  // Events [ MODE 1 ]
  private onMouseMoveMode_1(e: MouseEvent) {
    this._cLine = null;
    this.moveDraggableVertex(e);
  }

  private onMouseUpBoardMode_1(e: MouseEvent) {
    this.setDraggableVertexNull();
  }

  private onMouseDownVertexMode_1(id: number) {
    this.setDraggableVertex(id);
  }

  // Events [ MODE 2 ]
  private onMouseMoveMode_2(e: MouseEvent) {
    this._cLine = null;
    this.moveGraph(e);
  }

  private onMouseUpBoardMode_2(e: MouseEvent) {
    this.setDraggableVertexNull();
  }

  private onMouseDownVertexMode_2(id: number) {
    this.setDraggableVertex(id);
  }

  // Events [ MODE 3 ]
  private onMouseMoveMode_3(e: MouseEvent) {
    this._cLine = null;
    this.moveConnectedComponent(e);
  }

  private onMouseUpBoardMode_3(e: MouseEvent) {
    this.setDraggableVertexNull();
  }

  private onMouseDownVertexMode_3(id) {
    this.setDraggableVertex(id);
  }

  // Public Methods
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

  // Private Methods
  private addNewEdge(v1: Vertex, v2: Vertex) {
    const id = this._graph.edges.length ?  this._graph.edges.length : 0;
    const edge = new Edge(id, v1.id, v2.id, v1.cx, v1.cy, v2.cx, v2.cy);
    this._graph.edges.push(edge);
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

  private unselectAllElements() {
    this._selectedElements.forEach(e => {
      e.setDisabled();
    });
    this._selectedElements = [];
  }

  // TEST CODE
  colorTree() {
    this.graphDrawService.colorBredthFirstSpanningTree(this._graph, this._graph.vertices[0], 
                                                      this.graphCalcService.calcBreadthFirstSpanningTree(this._graph, this._graph.vertices[0]));
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

  // setPathHighlighted(path: number[]) {
  //   for (let i = 0; i < path.length - 1; i++) {
  //     const edgeId: number = this.getEdgeIdByverticesIds(path[i], path[i+1]);
  //     this._edges[edgeId].setHighlighted();
  //   }
  // }
  
}
