import { Component, OnInit, HostListener } from '@angular/core';
import { GraphService } from '../../_services/';
import { Graph, Vertex, Edge } from '../../_models';

@Component({
  selector: 'app-graphs-board',
  templateUrl: './graphs-board.component.html',
  styleUrls: ['./graphs-board.component.scss']
})
export class GraphsBoardComponent implements OnInit {

  graph: Graph;
  vertexs: Vertex[] = [];
  edges: Edge[] = [];
  graphOrder: number = 0;
  graphSize: number = 0;
  graphDegree: number = 0;
  
  /**
   * MODES:
   * 0 - draw graph
   * 1 - stretch graph
   * 2 - move graph
   * 3 - calculate any path
   * 4 - move only single component
   */
  mode: number;

  constructor(
    private graphService: GraphService
  ) { }

  ngOnInit() {
    this.initNewGraphView();  
    this.mode = 0;
  }

  initNewGraphView() {
    this.graphService.initNewGraph();
    this.updateGraphView();
  }

  updateGraphView() {
    this.graph = this.graphService.graph;
    this.vertexs = this.graphService.vertexs;
    this.edges = this.graphService.edges;
    this.updateGraphInfoView();
  }

  updateGraphInfoView() {
    this.graphOrder = this.vertexs.length;
    this.graphSize = this.edges.length;
    this.graphDegree = this.graphService.calcGraphDegree();
  }

  clearGraphsBoard() {
    this.graphService.removeCurrentGraph();
    this.graphService.initNewGraph();
    this.updateGraphView();
  }

  removeFromGraphsBoard() {
    this.graphService.removeSelectedElements();
    this.updateGraphView();
  }

  // Events
  drawNewVertex(e: MouseEvent) {
    if (this.mode === 0) {
      this.graphService.addNewVertex(e);
      this.updateGraphView();
    }
  }

  onClickVertex(id: number) {
    switch (this.mode) {
      case 0:
        this.graphService.onClickVertexMode_1(id);
        this.updateGraphView();
        break;
      case 3:
        this.graphService.onClickVertexMode_3(id);
        break;
    }
  }

  onClickEdge(id: number) {
    if (this.mode === 0) {
      this.graphService.onClickEdge(id);
      this.updateGraphView();
    }
  }

  onMouseMoveOnBoard(e: MouseEvent) {
    if (this.mode === 1) {
      this.graphService.moveDraggedVertex(e);
    } else if (this.mode === 2) {
      // move graph
      this.graphService.moveGraph(e);
    } else if (this.mode === 4) {
      this.graphService.moveConnectedComponent(e);
    }
  }

  dropDraggedVertex(e: MouseEvent) {   
    this.graphService.setDraggedVertexNull();
  }

  selectDraggableVertex(id: number) {
    if (this.mode === 1 || this.mode === 2 || this.mode === 4) {
      this.graphService.setDraggedVertex(id);
    } 
  }

  showLineGraph() {
    this.graphService.createLineGraph();
    this.graphService.setLineGraphActive();
    this.updateGraphView();
  }

  logGraph() {
    // console.clear();
    console.log('%cVERTEXS: ', 'font-weight: 700; color: blue')
    console.table(this.vertexs);
    console.log('%cEDGES: ', 'font-weight: 700; color: green')
    console.table(this.edges);
  }

  logAdjacencyMatrix() {
    this.graphService.updateAdjacencyMatrix();
    this.graphService.updateIncidenceMatrix();
    // console.clear();
    console.log('%cAdjacency matrix: ', 'font-weight: 700; color: blue');
    console.log(this.graphService.adjacencyMatrix);
    console.log('%cIncidence matrix: ', 'font-weight: 700; color: green');
    console.log(this.graphService.incidenceMatrix);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'q':
        this.mode = 1;
        break;
      case 'w':
        this.mode = 2;
        break;
      case 'a':
        this.mode = 3;
        break;
      case 'e':
        this.mode = 4;
        break;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onkeyup(e: KeyboardEvent) {
    switch (e.key) {
      case 'q':
        this.mode = 0;
        break;
      case 'w':
        this.mode = 0;
        break;
      case 'a':
        this.mode = 0;
        break;
      case 'e':
        this.mode = 0;
        break;
      case 'p':
        this.logGraph();
        break;
      case 'd':
        this.removeFromGraphsBoard();
        break;
      case 'm':
        this.logAdjacencyMatrix();
        break;
      case 'l':
        this.showLineGraph();
        break;
      case 'r':
        this.clearGraphsBoard();
        break;
      case 'c':
        console.clear();
        break;
      case 'k':
        console.log('Connected graph: ' + this.graphService.isGraphConnected());
        break;
      case 'n':
        this.graphService.colorConnectedComponents(this.graphService.calcConnectedComponents());
        break;
    }
  }

}
