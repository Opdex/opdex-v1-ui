import { LineData } from "lightweight-charts";

export abstract class BaseHistory {
  protected _removeZeros(points: LineData[]) {
    // Only remove if the chart data has values greater than 0
    if (points.length > 2 && points[0].value === 0 && points[points.length - 1].value > 0) {
      let index = 0;
      let point = points[index];

      while (point.value === 0) {
        point = points[++index];
      }

      points = points.slice(index);
    }

    return points;
  }
}
