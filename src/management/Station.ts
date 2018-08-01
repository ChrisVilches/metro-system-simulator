import IDemand from "./IDemand";
import TimeRange from "./TimeRange";

export default class Station{

  private _lastTrainTime: any;
  private _firstTrainTime: any;
  private _demand: IDemand[];
  private _isTerminal: boolean;

  constructor(demands: IDemand[], firstLastTimes: TimeRange = { firstTime: null, secondTime: null }){

    this._lastTrainTime = firstLastTimes.firstTime;
    this._firstTrainTime = firstLastTimes.secondTime;

    // Two directions
    this._demand = [null, null];
    this._demand[0] = demands[0] || null;
    this._demand[1] = demands[1] || null;

    if(this._demand[0] === null || this._demand[1] === null){
      throw Error("It must have a demand attribute for both directions.");
    }

    let times = 0;
    if(this._lastTrainTime) times++;
    if(this._firstTrainTime) times++;

    if(times === 2){
      this._isTerminal = true;
    }

    else if(times === 1){
      throw Error("For terminals, both first and last train times must be defined.");
    }

    else {
      this._isTerminal = false;
    }

  }

  public get demand():IDemand[]{
    return this._demand;
  }

  public get isTerminal(){
    return this._firstTrainTime !== null || this._lastTrainTime !== null;
  }


}
