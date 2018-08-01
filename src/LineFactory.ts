import Line from "./management/Line";
import Station from "./management/Station";
import * as _ from "lodash";
import { Util } from "./Util";

export default class LineFactory{

  public fromPhysicalPoints(points: any[]): Line{

    if(!_.first(points).isTerminal) throw Error("First station must be a terminal");
    if(!_.last(points).isTerminal) throw Error("Last station must be a terminal");

    for(let i=0; i<points.length; i++){
      if(points[i].hasOwnProperty("station") && !points[i].hasOwnProperty("demands")){
        throw Error("Stations must define their demands");
      }

      if(points[i].hasOwnProperty("terminal") && !points[i].hasOwnProperty("timeRange")){
        throw Error("Terminal stations must have a time range of operation");
      }
    }

    let stations = [];
    let distanceFromPrev = [];
    let accum = 0;
    for(let i=0; i<points.length; i++){

      if(i > 0){
        accum += Util.getDistance(points[i-1], points[i]);
      }

      if(!points[i].hasOwnProperty("station")) continue;

      if(points[i].isTerminal){
        stations.push(new Station(points[i].demands, points[i].timeRange));
      } else {
        stations.push(new Station(points[i].demands));
      }

      if(i > 0){
        distanceFromPrev.push(Math.floor(10000 * accum));
        accum = 0;
      }
    }

    return new Line(stations, distanceFromPrev);
  }

}
