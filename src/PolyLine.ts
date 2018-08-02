import * as _ from "lodash";
import { Util } from "./Util";
import Big from 'big.js';

export default class PolyLine{

  private _points: any[];
  private fullDistance: number;

  constructor(points: any[]){
    this._points = points.map(x => _.pick(x, ["lat", "lng"]));
    this.fullDistance = this.lineFullDistance();
  }

  public get points(){
    return this._points;
  }

  public getPointWithinRoute(_percent: number){
    if(_percent > 1) _percent = 1;
    if(_percent < 0) _percent = 0;

    if(_percent === 0) return this.points[0];
    if(_percent === 1) return _.last(this.points);

    let percent: Big = new Big(_percent);
    let percentDifference = percent;

    for(let i=0; i<this.points.length-1; i++){

      let a = this.points[i];
      let b = this.points[i+1];
      let distance = new Big(Util.getDistance(
        {lat: a.lat, lng: a.lng},
        {lat: b.lat, lng: b.lng}
      ));
      let p = distance.div(this.fullDistance);
      if(p.gt(percentDifference) || p.eq(percentDifference)){
        let segmentPercent = percentDifference.div(p);
        let dirLat = (new Big(b.lat)).minus(a.lat);
        let dirLng = (new Big(b.lng)).minus(a.lng);

        return {
          lat: +(new Big(a.lat)).plus((dirLat.times(segmentPercent))),
          lng: +(new Big(a.lng)).plus((dirLng.times(segmentPercent)))
        };
      }

      percentDifference = percentDifference.minus(p);
    }

    throw Error("Not found within route, value: " + percent);
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
