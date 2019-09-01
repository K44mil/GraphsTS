import { Injectable } from '@angular/core';
import { GraphService } from './graph.service';

@Injectable({
  providedIn: 'root'
})
export class GraphEventHandlerService {

  constructor(
    private graphService: GraphService
  ) { }

  handleBoardEvent(e: any, mode: number) {
    
  }

  handleVertexEvent(e: any, mode: number) {

  }

  handleEdgeEvent(e: any, mode: number) {

  }

  handleLoopEvent(e: any, mode: number) {
    
  }
}
