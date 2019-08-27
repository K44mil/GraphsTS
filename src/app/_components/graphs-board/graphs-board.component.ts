import { Component, OnInit } from '@angular/core';
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

  constructor(
    private graphService: GraphService
  ) { }

  ngOnInit() {
    //> TEST CODE - TO REMOVE
    this.initNewGraph();
    const ed = new Edge(1, 1, 1, 0, 0, 300, 400);
    console.log(ed);
    this.graphService.addEdge(ed);
    this.updateGraph();
    //<
  }

  initNewGraph() {
    this.graphService.initNewGraph();
    this.updateGraph();
  }

  updateGraph() {
    this.graph = this.graphService.graph;
    this.vertexs = this.graphService.vertexs;
    this.edges = this.graphService.edges;
  }

}
