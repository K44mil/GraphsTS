import { Injectable } from '@angular/core';
import { Graph, Edge, Vertex } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class GraphDrawService {

  constructor() { }

  private getRandomColor(): string {
    const colorR = Math.floor(Math.random() * (255 + 1));
    const colorG = Math.floor(Math.random() * (255 + 1));
    const colorB = Math.floor(Math.random() * (255 + 1));
    const randomColor = 'rgb(' + colorR.toString() + ', ' + colorG.toString() + ', ' + colorB.toString() + ')';
    return randomColor;
  }

  colorConnectedComponents(graph: Graph, C: number[]) {
    const { vertices } = graph;
    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    const cUniqueValues: number[] = C.filter(onlyUnique);
    cUniqueValues.forEach((uv) => {
      const randomColor = this.getRandomColor();
      vertices.forEach(v => {
        if (C[v.id] === uv) {
          vertices[v.id].fill = randomColor;
          const connectedEdges: Edge[] = graph.getEdgesByVertexId(v.id);
          if (connectedEdges.length > 0) {
            connectedEdges.forEach(e => {
              e.stroke = randomColor;
            });
          }
        }
      });
    });
  }

  colorBredthFirstSpanningTree(graph: Graph, bfsTreeRoot: Vertex, T: number[][]) {
    const { vertices, edges } = graph;
    const randomColor = this.getRandomColor();
    bfsTreeRoot.fill = this.getRandomColor();
    for (let i = 0; i < vertices.length; i++) {
      for (let j = 0; j < T[i].length; j++) {
        if (graph.isDigraph) {
          let edges: Edge[] = [];
          if (graph.getEdgeByVerticesIds(i, T[i][j]))
            edges.push(graph.getEdgeByVerticesIds(i, T[i][j]));
          if (graph.getEdgeByVerticesIds(T[i][j], i))
            edges.push(graph.getEdgeByVerticesIds(T[i][j], i));
          edges.forEach(e => {
            e.stroke = randomColor;
          });
          graph.getVertexById(T[i][j]).fill = randomColor;
          // color arrows
          if (graph.getEdgeByVerticesIds(i, T[i][j])) {
            const id = graph.getEdgeByVerticesIds(i, T[i][j]).id.toString()
            document.getElementById('arrow' + id).setAttribute('fill', randomColor);
          }
        } else {
          const edge = edges[graph.getEdgeByVerticesIds(i, T[i][j]) ? graph.getEdgeByVerticesIds(i, T[i][j]).id : graph.getEdgeByVerticesIds(T[i][j], i).id];
          graph.getVertexById(T[i][j]).fill = randomColor;
          edge.stroke = randomColor;
        }
      }
    }
  }
}
