import { Injectable } from '@angular/core';
import { Vertex, Edge, Loop, Graph } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class GraphCalcService {

  constructor() { }

  createAdjacencyMatrix(graph: Graph): number[][] {
    let aMatrix: number[][] = [];
    const { vertices, edges, loops, isDigraph } = graph;
    for (let i = 0; i < vertices.length; i++) {
      aMatrix[i] = new Array(vertices.length);
      aMatrix[i].fill(0, 0, vertices.length);
    }
    for (let i = 0; i < vertices.length; i++) {
      for (let j = 0; j < vertices.length; j++) {
        edges.forEach(e => {
          if (isDigraph) {
            if (e.v1 === i && e.v2 === j)
              aMatrix[i][j] = e.factor;
          } else {
            if ((e.v1 === i && e.v2 === j) || (e.v1 === j && e.v2 === i))
              aMatrix[i][j] = e.factor;  
          } 
        });
      }
      loops.forEach(l => {
        if (l.v === i)
          if (isDigraph)
            aMatrix[i][i] = 1;
          else
            aMatrix[i][i] = 2;
      });
    }
    return aMatrix;
  }

  createIncidenceMatrix(graph: Graph): number[][] {
    let iMatrix: number[][] = [];
    const { vertices, edges, loops, isDigraph } = graph;
    for (let i = 0; i < vertices.length; i++) {
      iMatrix[i] = [];
      for (let j = 0; j < edges.length + loops.length; j++) {
        iMatrix[i][j] = 0;
      }
    }
    for (let i = 0; i < vertices.length; i++) {
      for (let j = 0; j < edges.length; j++) {
        if (isDigraph)
          if (edges[j].v1 === i)
            iMatrix[i][j] = 1;
          else if (edges[j].v2 === i)
            iMatrix[i][j] = -1;
        else
          if (edges[j].v1 === i || edges[j].v2 === i)
            iMatrix[i][j] = 1; 
      }
      for (let j = edges.length; j < loops.length; j++) {
        if (loops[i].v === i)
          iMatrix[i][j] = 2;
      }
    }
    return iMatrix;
  }

  createAdjacencyLists(graph: Graph): number[][] {
    let aLists: number[][] = [];
    const { vertices, edges, loops, isDigraph } = graph;
    for (let i = 0; i < vertices.length; i++) {
      aLists[i] = [];
      for (let j = 0; j < edges.length; j++) {
        if (isDigraph)
          if (edges[j].v1 === i)
            aLists[i].push(edges[j].v2);
        else
          if (edges[j].v1 === i)
            aLists[i].push(edges[j].v2);
          else if (edges[j].v2 === i)
            aLists[i].push(edges[j].v1);
      }
      for (let j = 0; j < loops.length; j++) {
        if (loops[j].v === i)
          aLists[i].push(i);
      }
    }
    return aLists;
  }

  calcConnectedComponents(graph: Graph): number[] {
    const aMatrix = this.createAdjacencyMatrix(graph);
    const { vertices } = graph;
    let C: number[] = new Array(vertices.length);
    let verticesStack: number[] = [];
    let cComponentsCounter = 0;
    C.fill(0, 0, C.length);
    for (let i = 0; i < vertices.length; i++) {
      if (C[i] > 0)
        continue;
      cComponentsCounter++;
      verticesStack.push(i);
      C[i] = cComponentsCounter;
      while (verticesStack.length > 0) {
        let v = verticesStack[verticesStack.length - 1];
        verticesStack.pop()
        for (let u = 0; u < vertices.length; u++) {
            if (u === v)
              continue;
            if (aMatrix[v][u] === 1) {
              if (C[u] > 0)
                continue;
              verticesStack.push(u);
              C[u] = cComponentsCounter;
            }
        }
      }
    }
    return C;
  }

}
