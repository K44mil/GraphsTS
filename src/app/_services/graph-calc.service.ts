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

  calcGraphDegree(graph: Graph): number {
    const aMatrix = this.createAdjacencyMatrix(graph);
    const { vertices } = graph;
    if (vertices.length > 0) {
      let verticesDegrees: number[] = new Array(vertices.length);
      verticesDegrees.fill(0, 0, vertices.length);
      for (let i = 0; i < vertices.length; i++) {
        for (let j = 0; j < vertices.length; j++) {
          if (aMatrix[i][j] === 1)
            verticesDegrees[i]++;
          else if (aMatrix[i][j] === 2)
            verticesDegrees[i] += 2;
        } 
      }
      return Math.max(...verticesDegrees);
    } else {
      return 0;
    }
  }

  // Check if graf is connected or not
  isGraphConnected(graph: Graph): boolean {
    const aMatrix = this.createAdjacencyMatrix(graph);
    const { vertices } = graph;
    let visited: boolean[] = new Array(vertices.length);
    let verticesStack: number[] = [];
    let countVisited = 0;
    visited.fill(false, 0, visited.length);
    verticesStack.push(0);
    visited[0] = true;
    while (verticesStack.length > 0) {
      let v = verticesStack[verticesStack.length-1];
      verticesStack.pop();
      countVisited++;
      for (let u = 0; u < vertices.length; u++) {
        if (u === v)
          continue;
        if (aMatrix[v][u] === 1) {
          if (visited[u] === true)
            continue;
            visited[u] = true;
            verticesStack.push(u);
        }
      }
    }
    if (countVisited === vertices.length)
      return true;
    return false;
  }

  // @@@ Calculate any path
  private $_visited: boolean[];
  private $_verticesStack: number[];

  calcAnyPath(graph: Graph, startVertex: Vertex, endVertex: Vertex) {
    const { vertices } = graph;
    const aMatrix = this.createAdjacencyMatrix(graph);
    this.$_visited = new Array(vertices.length);
    this.$_visited.fill(false, 0, this.$_visited.length);
    this.$_verticesStack = [];
    if (this.DFS(startVertex.id, graph, endVertex, aMatrix) === false)
      return [];
    else
      return this.$_verticesStack;
  }

  private DFS(id: number, graph: Graph, endVertex: Vertex, aMatrix: number[][]): boolean {
    const { vertices } = graph;
    this.$_visited[id] = true;
    this.$_verticesStack.push(id);
    if (id === endVertex.id) {
      return true;
    }
    for (let i = 0; i < vertices.length; i++) {
      if (i === id)
        continue;
      if (aMatrix[id][i] === 1) {
        if (this.$_visited[i] === true)
          continue;
        if (this.DFS(i, graph, endVertex, aMatrix) === true)
          return true;
      }
    }
    this.$_verticesStack.pop();
    return false;
  }
  // @@@

  calcBreadthFirstSpanningTree(graph: Graph, bfsTreeRoot: Vertex): number[][] {
    const aMatrix = this.createAdjacencyMatrix(graph);
    const { vertices } = graph;
    let visited: boolean[] = new Array(vertices.length);
    let T: number[][] = [];
    let Q: number[] = [];
    visited.fill(false, 0, visited.length);
    for (let i = 0; i < vertices.length; i++) {
      T[i] = [];
    }
    Q.push(-1); Q.push(bfsTreeRoot.id);
    visited[bfsTreeRoot.id] = true;
    while (Q.length > 0) {
      let v = Q[0]; Q.reverse(); Q.pop(); Q.reverse();
      let w = Q[0]; Q.reverse(); Q.pop(); Q.reverse();
      if (v > -1)
        T[v].push(w);
      for (let z = 0; z < vertices.length; z++) {
        if (z === w)
          continue;
        if (aMatrix[w][z] === 1) {
          if (visited[z] === true)
            continue;
          visited[z] = true;
          Q.push(w);
          Q.push(z);
        }
      }
    }
    return T;
  }

}
