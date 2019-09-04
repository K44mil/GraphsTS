import { Component, OnInit, HostListener, Host } from '@angular/core';
import { GraphService } from '../../_services/graph.service';
import { Graph } from '../../_models';
import { Line } from '../../_models/_svgModels/line';

@Component({
  selector: 'app-graphs-board',
  templateUrl: './graphs-board.component.html',
  styleUrls: ['./graphs-board.component.scss']
})
export class GraphsBoardComponent implements OnInit {

  graph: Graph;
  cLine: Line;
  /**
     * MODES:
     * 0 - draw graph
     * 1 - stretch graph
     * 2 - move graph
     * 3 - move only single component
     * 4 - move only single component
     * 5 - spanning tree root select 
     */
  isBoardActive = false;
  mode: number = 0;

  constructor(
    private graphService: GraphService
  ) { }

  ngOnInit() {

  }

  initNewGraph() {
    this.graphService.initNewGraph();
    this.updateGraphView();
    this.isBoardActive = true;
  }

  initNewDigraph() {
    // TODO
    this.updateGraphView();
    this.isBoardActive = true;
  }

  updateGraphView() {
    this.graph = this.graphService.graph;
    this.cLine = this.graphService.cLine;
  }

  // Events
  onClickBoard(e: MouseEvent) {
    if (this.isBoardActive) {
      this.graphService.handleBoardEvent(e, this.mode);
      this.updateGraphView();
    }
  }

  onClickVertex(e: MouseEvent, id: number) {
    if (this.isBoardActive) {
      this.graphService.handleVertexEvent(e, id, this.mode);
      this.updateGraphView();
    }
  }

  onClickEdge(id: number) {
    if (this.isBoardActive) {
      this.graphService.handleEdgeEvent(id, this.mode);
      this.updateGraphView();
    }
  }

  onClickLoop(id: number) {
    if (this.isBoardActive) {
      this.graphService.handleLoopEvent(id, this.mode);
      this.updateGraphView();
    }
  }

  onDblclickVertex(e: MouseEvent, id: number) {
    if (this.isBoardActive) {
      this.graphService.handleVertexEvent(e, id, this.mode);
      this.updateGraphView();
    }
  }

  onDblclickBoard(e: MouseEvent) {
    console.log('dblclick');
    if (this.isBoardActive) {
      console.log('dblclick active');
      this.graphService.handleBoardEvent(e, this.mode);
      this.updateGraphView();
    }
  }

  onMouseDownVertex(e: MouseEvent, id: number) {
    if (this.isBoardActive) {
      this.graphService.handleVertexEvent(e, id, this.mode);
      this.updateGraphView();
    }
  }

  onMouseUpVertex(e: MouseEvent, id: number) {
    if (this.isBoardActive) {
      this.graphService.handleVertexEvent(e, id, this.mode);
      this.updateGraphView();
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.isBoardActive) {
      this.graphService.handleBoardEvent(e, this.mode);
      this.updateGraphView();
    }
  }

  onMouseUpBoard(e: MouseEvent) {
    if (this.isBoardActive) {
      this.graphService.handleBoardEvent(e, this.mode);
      this.updateGraphView();
    }
  }

  onWheelBoard(e: MouseEvent) {
    if (this.isBoardActive){
      // TODO
    }
  }

  logGraph() {
      console.log('%cVERTICES: ', 'font-weight: 700; color: blue')
      console.table(this.graph.vertices);
      console.log('%cEDGES: ', 'font-weight: 700; color: green')
      console.table(this.graph.edges);
      console.log('%cLOOPS: ', 'font-weight: 700; color: red')
      console.table(this.graph.loops);
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
      case 'e':
        this.mode = 3;
        break;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case 'q':
        this.mode = 0;
        break;
      case 'w':
        this.mode = 0;
        break;
      case 'e':
        this.mode = 0;
        break;
      case 'p':
        this.logGraph();
        break;
      case 'c':
        console.clear();
        break;
    }
  }

  @HostListener('document:keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    switch(e.key) {
      case 'd':
        this.graphService.deleteSelectedElements();
        break;
      case 'm':
        this.graphService.colorTree();
        break;
    }
  }

  // updateGraphInfoView() {
  //   this.graphOrder = this.vertices.length;
  //   this.graphSize = this.edges.length;
  //   this.graphDegree = this.graphService.calcGraphDegree();
  // }

  // clearGraphsBoard() {
  //   this.graphService.removeCurrentGraph();
  //   this.graphService.initNewGraph();
  //   this.updateGraphView();
  // }

  // removeFromGraphsBoard() {
  //   this.graphService.removeSelectedElements();
  //   this.updateGraphView();
  // }

  // onClickVertex(id: number) {
  //   switch (this.mode) {
  //     case 0:
  //       this.graphService.onClickVertexMode_1(id);
  //       this.updateGraphView();
  //       break;
  //     case 3:
  //       this.graphService.onClickVertexMode_3(id);
  //       break;
  //     case 5:
  //       this.graphService.onClickVertexMode_5(id);
  //       break;
  //   }
  // }

  // onMouseMoveOnBoard(e: MouseEvent) {
  //   if (this.mode === 1) {
  //     this.graphService.moveDraggedVertex(e);
  //   } else if (this.mode === 2) {
  //     // move graph
  //     this.graphService.moveGraph(e);
  //   } else if (this.mode === 4) {
  //     this.graphService.moveConnectedComponent(e);
  //   }
  // }

  // dropDraggedVertex(e: MouseEvent) {   
  //   this.graphService.setDraggedVertexNull();
  // }

  // selectDraggableVertex(id: number) {
  //   if (this.mode === 1 || this.mode === 2 || this.mode === 4) {
  //     this.graphService.setDraggedVertex(id);
  //   } 
  // }

  // showLineGraph() {
  //   this.graphService.createLineGraph();
  //   this.graphService.setLineGraphActive();
  //   this.updateGraphView();
  // }

  // logGraph() {
  //   // console.clear();
  //   console.log('%cvertices: ', 'font-weight: 700; color: blue')
  //   console.table(this.vertices);
  //   console.log('%cEDGES: ', 'font-weight: 700; color: green')
  //   console.table(this.edges);
  // }

  // logGraphMatrixs() {
  //   this.graphService.updateAdjacencyMatrix();
  //   this.graphService.updateIncidenceMatrix();
  //   this.graphService.updateAdjacencyLists();
  //   // console.clear();
  //   console.log('%cAdjacency matrix: ', 'font-weight: 700; color: blue');
  //   console.log(this.graphService.adjacencyMatrix);
  //   console.log('%cIncidence matrix: ', 'font-weight: 700; color: green');
  //   console.log(this.graphService.incidenceMatrix);
  //   console.log('%cAdjacency lists: ', 'font-weight: 700; color: red');
  //   console.log(this.graphService.adjacencyLists);
  // }

  // @HostListener('document:keydown', ['$event'])
  // onKeyDown(e: KeyboardEvent) {
  //   switch (e.key) {
  //     case 'q':
  //       this.mode = 1;
  //       break;
  //     case 'w':
  //       this.mode = 2;
  //       break;
  //     case 'a':
  //       this.mode = 3;
  //       break;
  //     case 'e':
  //       this.mode = 4;
  //       break;
  //     case 't':
  //       this.mode = 5;
  //       break;
  //   }
  // }

  // @HostListener('document:keyup', ['$event'])
  // onkeyup(e: KeyboardEvent) {
  //   switch (e.key) {
  //     case 'q':
  //       this.mode = 0;
  //       break;
  //     case 'w':
  //       this.mode = 0;
  //       break;
  //     case 'a':
  //       this.mode = 0;
  //       break;
  //     case 'e':
  //       this.mode = 0;
  //       break;
  //     case 't':
  //       this.mode = 0;
  //       break;
  //     case 'p':
  //       this.logGraph();
  //       break;
  //     case 'd':
  //       this.removeFromGraphsBoard();
  //       break;
  //     case 'm':
  //       this.logGraphMatrixs();
  //       break;
  //     case 'l':
  //       this.showLineGraph();
  //       break;
  //     case 'r':
  //       this.clearGraphsBoard();
  //       break;
  //     case 'c':
  //       console.clear();
  //       break;
  //     case 'k':
  //       console.log('Connected graph: ' + this.graphService.isGraphConnected());
  //       break;
  //     case 'n':
  //       this.graphService.colorConnectedComponents(this.graphService.calcConnectedComponents());
  //       break;
  //   }

  }