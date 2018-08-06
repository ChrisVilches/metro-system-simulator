import { Line } from "./management/Line";
import Station from "./management/Station";
import * as _ from "lodash";
import { Util } from "./Util";
import IDemand from "./management/IDemand";
import TimeRange from "./management/TimeRange";
import Time from "./management/Time";
import PolyLine from "./PolyLine";
import { DemandQuarters, DemandQuartersArgument } from "./management/DemandQuarters";

const demand1Json: DemandQuartersArgument[] = require("./sampledata/demand1.json");
const demand2Json: DemandQuartersArgument[] = require("./sampledata/demand2.json");


export interface LineFactoryPhysicalPoint{
  isTerminal?: boolean;
  lat: number;
  lng: number;
  station?: string;
  demands?: any[];
  timeRange?: TimeRange;
}

export interface StationPhysical{
  lat: number;
  lng: number;
  name: string;
}


export class LinePhysical {

  private _points: LineFactoryPhysicalPoint[];
  private _polyLine: PolyLine;
  private _stationLocations: StationPhysical[];
  private _color: string;
  private _line: Line;
  private _name: string;

  constructor(phyiscalPoints: LineFactoryPhysicalPoint[], name: string, color: string){

    this._color = color;
    this._name = name;

    this._points = phyiscalPoints;
    this._points.map(p => { if(p.station) p.demands = [new DemandQuarters(demand1Json), new DemandQuarters(demand2Json)] });
    this._points.map(p => { if(p.isTerminal) p.timeRange = new TimeRange(new Time(8, 0), new Time(23, 0)) });

    let lineFactory: LineFactory = new LineFactory();
    this._line = lineFactory.fromPhysicalPoints(this._points);
    this._polyLine = new PolyLine(this._points);

    this._stationLocations = [];
    this._points.map(p => { if(p.station) this._stationLocations.push({ lat: p.lat, lng: p.lng, name: p.station }) });

  }

  public get name(){
    return this._name;
  }

  public get polyLine(){
    return this._polyLine;
  }

  public get color(){
    return this._color;
  }

  public get stationLocations(){
    return this._stationLocations;
  }

  public get line(){
    return this._line;
  }
}




export class LineFactory{

  public fromPhysicalPoints(points: LineFactoryPhysicalPoint[], scaleFactor: number = 10000): Line{

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
        distanceFromPrev.push(Math.floor(scaleFactor * accum));
        accum = 0;
      }
    }

    return new Line(stations, distanceFromPrev);
  }

}
