import { Train } from "./Train";

export enum MonitorState{
  OK,
  DANGEROUS_SCHEDULING,
  TRAIN_COLLISION
}

export class Monitor{

  private _safeDistance: number = 200;

  constructor(){

  }

  public computeDanger(trains: Train[]): number{
    let maxDanger: number = 0;
    for(let i=0; i<trains.length-1; i++){
      let t1: Train = trains[i];
      let t2: Train = trains[i+1];
      let dist = Math.abs(t1.currentPos - t2.currentPos);

      if(dist > this._safeDistance) continue;
      maxDanger = Math.max(maxDanger, (this._safeDistance-dist)/this._safeDistance);
    }
    return maxDanger;
  }


  public get safeDistance(){
    return this._safeDistance;
  }

  public set safeDistance(d: number){
    this._safeDistance = d;
  }

}
