import * as _ from "lodash";
import { Util } from "./Util";
import Big from 'big.js';

export default class PolyLine{

  private _points: any[];
  private _color: string = "#000000";
  private fullDistance: number;

  constructor(points: any[], color?: string){
    this._points = points.map(x => _.pick(x, ["lat", "lng"]));
    this.fullDistance = this.lineFullDistance();
    this._color = color;
  }

  public get points(){
    return this._points;
  }

  public get color(){
    return this._color;
  }

  public getPointWithinRoute(percent: number){
    if(percent > 1) percent = 1;
    if(percent < 0) percent = 0;

    let percentDifference = percent;
    for(let i=0; i<this.points.length-1; i++){

      let a = this.points[i];
      let b = this.points[i+1];
      let distance = Util.getDistance(
        {lat: a.lat, lng: a.lng},
        {lat: b.lat, lng: b.lng}
      );
      let percent = distance/this.fullDistance;
      if(percentDifference <= percent){
        let segmentPercent = percentDifference/percent;
        let dirLat = b.lat - a.lat;
        let dirLng = b.lng - a.lng;

        return {
          lat: a.lat + (dirLat * segmentPercent),
          lng: a.lng + (dirLng * segmentPercent)
        };
      }

      percentDifference -= percent;
    }

    throw Error("Not found within route");
  }

  private lineFullDistance(){
    let fullDistance = 0;
    for(let i=0; i<this.points.length-1; i++){
      let a = this.points[i];
      let b = this.points[i+1];
      fullDistance += Util.getDistance(
        {lat: a.lat, lng: a.lng},
        {lat: b.lat, lng: b.lng}
      );
    }
    return fullDistance;
  }

}
