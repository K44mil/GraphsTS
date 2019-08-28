import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SvgGraphicsService {

  constructor() { }

  parsePoint(e: MouseEvent) {
    const svgElement = e.target as SVGElement;
    let svgSvgElement = e.target as SVGSVGElement;

    if (!(svgElement instanceof SVGSVGElement)) {
      svgSvgElement = svgElement.ownerSVGElement;
    }

    let point = svgSvgElement.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    point = point.matrixTransform(svgSvgElement.getScreenCTM().inverse());

    return point;
  }
}
