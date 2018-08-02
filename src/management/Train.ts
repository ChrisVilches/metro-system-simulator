import * as _ from "lodash";
import IUpdatable from "./IUpdatable";

export default abstract class Train implements IUpdatable{

  protected _currentPos: number;
  protected signalStopPoint: number;
  protected stopPoints: any[];

  constructor(stopPoints:any[], initPoint: number){
    this.signalStopPoint = Infinity;
    this._currentPos = stopPoints[initPoint]; // Distance across the line
    this.stopPoints = _.cloneDeep(stopPoints);
  }

  abstract update();

  public get currentPos(){
    return this._currentPos;
  }

  public signalStop(position: number){
    if(position <= this._currentPos) return;
    // Get the closest
    this.signalStopPoint = Math.min(this.signalStopPoint, position);
  }

}
