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
  
  /**
   * MODES:
   * 0 - draw graph
   * 1 - stretch graph
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
    if (this.mode === 0) {
      this.graphService.onClickVertex(id);
      this.updateGraphView();
    }
  }

  onClickEdge(id: number) {
    if (this.mode === 0) {
      this.graphService.onClickEdge(id);
      this.updateGraphView();
    }
  }

  moveDraggedVertex(e: MouseEvent) {
    if (this.mode === 1) {
      this.graphService.moveDraggedVertex(e);
    }
  }

  dropDraggedVertex(e: MouseEvent) {   
    this.graphService.setDraggedVertexNull();
  }

  putDraggableVertex(id: number) {
    if (this.mode === 1) {
      this.graphService.setDraggedVertex(id);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'q':
        this.mode = 1;
        break;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onkeyup(e: KeyboardEvent) {
    switch (e.key) {
      case 'q':
        this.mode = 0;
        break;
    }
  }

}
