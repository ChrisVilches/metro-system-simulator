import Train from "./Train";

export default class Monitor{

  private _trains: Train[];
  private _safeDistance: number = 200;

  constructor(){

  }

  public computeDanger(): number{
    console.log("Computing...")
    let maxDanger: number = 0;
    for(let i=0; i<this._trains.length-1; i++){
      let t1: Train = this._trains[i];
      let t2: Train = this._trains[i+1];
      let dist = Math.abs(t1.currentPos - t2.currentPos);

      if(dist > this._safeDistance) continue;
      maxDanger = Math.max(maxDanger, (this._safeDistance-dist)/this._safeDistance);
    }
    return maxDanger;
  }

  public get trains(){
    return this._trains;
  }

  public set trains(t: Train[]){
    this._trains = t;
  }

  public get safeDistance(){
    return this._safeDistance;
  }

  public set safeDistance(d: number){
    this._safeDistance = d;
  }

}
