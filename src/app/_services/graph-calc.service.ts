import { Injectable } from '@angular/core';
import { Vertex, Edge, Loop } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class GraphCalcService {

  constructor() { }

  createAdjacencyMatrix(vertices: Vertex[], edges: Edge[], loops: Loop[], isDirected: boolean): number[][] {
    let aMatrix: number[][] = [];
    for (let i = 0; i < vertices.length; i++) {
      aMatrix[i] = new Array(vertices.length);
      aMatrix[i].fill(0, 0, vertices.length);
    }
    for (let i = 0; i < vertices.length; i++) {
      for (let j = 0; j < vertices.length; j++) {
        edges.forEach(e => {
          if (isDirected)
            if (e.v1 === i && e.v2 === j)
              aMatrix[i][j] = e.factor;
          else 
            if ((e.v1 === i && e.v2 === j) || (e.v1 === j && e.v2 === i))
              aMatrix[i][j] = e.factor;  
        });
      }
      loops.forEach(l => {
        if (l.v === i)
          if (isDirected)
            aMatrix[i][i] = 1;
          else
            aMatrix[i][i] = 2;
      });
    }
    return aMatrix;
  }

  createIncidenceMatrix(vertices: Vertex[], edges: Edge[], loops: Loop[], isDirected: boolean): number[][] {
    let iMatrix: number[][] = [];
    for (let i = 0; i < vertices.length; i++) {
      iMatrix[i] = [];
      for (let j = 0; j < edges.length + loops.length; j++) {
        iMatrix[i][j] = 0;
      }
    }
    for (let i = 0; i < vertices.length; i++) {
      for (let j = 0; j < edges.length; j++) {
        if (isDirected)
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

  createAdjacencyLists(vertices: Vertex[], edges: Edge[], loops: Loop[], isDirected: boolean): number[][] {
    let aLists: number[][] = [];
    for (let i = 0; i < vertices.length; i++) {
      aLists[i] = [];
      for (let j = 0; j < edges.length; j++) {
        if (isDirected)
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

}
