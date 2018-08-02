import * as _ from "lodash";
import IUpdatable from "./IUpdatable";

export enum TrainState {
  MOVING,
  STOPPED_AT_STATION,
  ENTERING_TERMINAL
}


export abstract class Train implements IUpdatable{

  protected _currentPos: number;
  protected signalStopPoint: number;
  protected stopPoints: any[];
  protected state: TrainState;

  constructor(stopPoints:any[], initPoint: number){
    this.signalStopPoint = Infinity;
    this._currentPos = stopPoints[initPoint]; // Distance across the line
    this.stopPoints = _.cloneDeep(stopPoints);
  }

  public abstract update();
  protected abstract stateMoving(): void;
  protected abstract stateEnteringTerminal(): void;
  protected abstract stateStoppedAtStation(): void;

  public get currentState(){
    return this.state;
  }

  public get currentPos(){
    return this._currentPos;
  }

  public signalStop(position: number): void{
    if(position <= this._currentPos) return;
    // Get the closest
    this.signalStopPoint = Math.min(this.signalStopPoint, position);
  }

}
