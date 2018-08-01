import * as _ from "lodash";
import IUpdatable from "./IUpdatable";

enum State {
  ACCELERATING,
  DEACCELERATING,
  STOPPED_AT_STATION,
  ENTERING_TERMINAL
}

const MAX_SPEED_DEFAULT: number = 20;
const ACCELERATION_DEFAULT: number = 3;
const MAX_WAIT_TIME: number = 8;
const WAIT_ENTER_TERMINAL: number = 5;

export default class Train implements IUpdatable{

  private _currentPos:number;
  private stopPoints:any[];
  private nextStopPoint:number;
  private speed:number;
  private maxSpeed:number;
  private acceleration:number;
  private maxWaitTime:number;
  private currentWaitTimeStation:number;
  private waitEnterTerminal:number;
  private state:State;
  private _doneFlag:boolean = false;

  constructor(stopPoints:any[], initPoint: number, options: any = {}){


    // The train only moves.
    // It may receive signals to reduce speed or stop if there was an accident,
    // but in general it only wants to get to the target stations.

    this._currentPos = stopPoints[initPoint]; // Distance across the line

    // Stop points
    // All stations where this train stops
    // This allows flexibility and things like finishing at a certain terminal
    // Or skipping certain stations.
    // Note that the terminal (initial) station can also be skipped
    // (don't take passengers there and go straight to a certain station and then
    // continue the trip)
    // The stop points can't be changed after it begins.
    this.stopPoints = _.cloneDeep(stopPoints);
    this.nextStopPoint = initPoint+1;

    this.speed = 0;


    this.maxSpeed = typeof options.maxSpeed !== "undefined"? options.maxSpeed : MAX_SPEED_DEFAULT;
    this.acceleration = typeof options.acceleration !== "undefined"? options.acceleration : ACCELERATION_DEFAULT;
    this.maxWaitTime = typeof options.maxWaitTime !== "undefined"? options.maxWaitTime : MAX_WAIT_TIME; // fixed, although it could have some randomizing and depending on how big the station is it could take a bit more
    this.waitEnterTerminal = typeof options.waitEnterTerminal !== "undefined"? options.waitEnterTerminal : WAIT_ENTER_TERMINAL;

    this.state = State.ACCELERATING;

  }

  public get doneFlag(){
    return this._doneFlag;
  }

  // If the dispatcher thinks it's dangerous to advance, then it'll execute this method
  // and it'll slow down. But the train wants to always accelerate (until it gets to the target station)
  public signalDanger(){

  }

  public get currentPos(){
    return this._currentPos;
  }

  private stateAccelerating(){
    console.log("(currPos "+this._currentPos+", stoppoints "+this.stopPoints+")")

    let nextSpeed = this.speed + this.acceleration;

    let rangeA = this._currentPos;
    let rangeB = this._currentPos + nextSpeed;

    let between = rangeA <= this.stopPoints[this.nextStopPoint] && this.stopPoints[this.nextStopPoint] <= rangeB;
    let same = this._currentPos === this.stopPoints[this.nextStopPoint];

    if(between || same){

      this._currentPos = this.stopPoints[this.nextStopPoint];

      this.nextStopPoint++;

      if(this.nextStopPoint >= this.stopPoints.length){
        this.state = State.ENTERING_TERMINAL;
        this.currentWaitTimeStation = this.waitEnterTerminal;
      } else {
        this.currentWaitTimeStation = this.maxWaitTime;
        this.state = State.STOPPED_AT_STATION;
      }

    } else {
      this.speed = Math.min(nextSpeed, this.maxSpeed);
      this._currentPos += this.speed;
    }

    // Falta un estado que sirva para desacelerar
  }

  private stateEnteringTerminal(){
    this.speed = 0;
    this.currentWaitTimeStation--;

    if(this.currentWaitTimeStation === 0){
      console.log(`Train exit`);
      this._doneFlag = true;
    }
  }

  private stateDeaccelerating(){
    console.log("Update train, decrease speed")
    this.speed -= this.acceleration;
    this.speed = Math.max(this.speed, 0);
  }

  private stateStoppedAtStation(){
    this.currentWaitTimeStation--;
    this.speed = 0;
    console.log("STopped, current pos: " + this._currentPos)
    if(this.currentWaitTimeStation === 0){
      console.log(`train STARTS after being stopped`);
      this.state = State.ACCELERATING;
    }
  }

  public update(){
    switch(this.state){
      case State.ACCELERATING:
      this.stateAccelerating();
      break;
      case State.DEACCELERATING:
      this.stateDeaccelerating();
      break;
      case State.STOPPED_AT_STATION:
      this.stateStoppedAtStation();
      break;
      case State.ENTERING_TERMINAL:
      this.stateEnteringTerminal();
      break;
      default:
      throw Error("Incorrect state");
    }
  }

}
