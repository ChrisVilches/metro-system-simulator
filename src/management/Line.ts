import Station from "./Station";
import * as _ from "lodash";

export default class Line{

  private _stations: Station[];
  private _accumDistances: number[];

  constructor(stations:any){
    this._stations = [];
    let distances:any = [];

    stations.map(s => {
      if(this.stations.length !== 0){
        distances.push(s.distanceFromPrev);
      }
      this.stations.push(s.station);
    });

    this._accumDistances = [0];

    distances.map(d => {
      let prev = _.last(this._accumDistances);
      this._accumDistances.push(prev + d);
    });

    if(!this.stations[0].isTerminal) throw Error("First station must be a terminal.");

    if(!(<Station>_.last(this.stations)).isTerminal) throw Error("Last station must be a terminal.");
  }

  public get stations(){
    return this._stations;
  }

  public getDistance(index1:number, index2:number){
    let accum = this._accumDistances;
    return accum[index2] - accum[index1];
  }

  public get fullLength(){
    return this.getDistance(0, this.stations.length-1);
  }

}



/*
* Test
*/
/*
let st1 = new Station({firstTrainTime: { hr: 6, min: 0 }, lastTrainTime: { hr: 11, min: 30 }});
let st2 = new Station();
let st3 = new Station({firstTrainTime: { hr: 7, min: 0 }, lastTrainTime: { hr: 0, min: 30 }});
let st4 = new Station();
let st5 = new Station({firstTrainTime: { hr: 6, min: 30 }, lastTrainTime: { hr: 1, min: 30 }});

let stations = [
  { station: st1, distanceFromPrev: null },
  { station: st2, distanceFromPrev: 100 },
  { station: st3, distanceFromPrev: 150 },
  { station: st4, distanceFromPrev: 50 },
  { station: st5, distanceFromPrev: 32 }
];

let l = new Line(stations);

console.assert(l.getDistance(0, 1) === 100);
console.assert(l.getDistance(0, 2) === 250);
console.assert(l.getDistance(0, 3) === 300);
console.assert(l.getDistance(1, 3) === 200);
console.assert(l.getDistance(2, 3) === 50);
console.assert(l.getDistance(3, 3) === 0);
console.assert(l.getDistance(3, 4) === 32);
console.assert(l.getDistance(2, 4) === 82);
console.assert(l.getDistance(1, 4) === 232);
*/
