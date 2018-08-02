import * as _ from "lodash";
import Train from "./Train";

enum State {
  MOVING,
  STOPPED_AT_STATION,
  ENTERING_TERMINAL
}

const MAX_SPEED_DEFAULT: number = 15;
const ACCELERATION_DEFAULT: number = 1;
const MAX_WAIT_TIME: number = 8;
const WAIT_ENTER_TERMINAL: number = 5;


export interface SimpleAccelerationTrainOptions{
  maxSpeed?: number;
  acceleration?: number;
  maxWaitTime?: number;
  waitEnterTerminal?: number;
  skipFirstTerminal?: boolean;
}


export class SimpleAccelerationTrain extends Train {

  private nextStopPoint:number;
  private speed:number;
  private maxSpeed:number;
  private acceleration:number;
  private maxWaitTime:number;
  private currentWaitTimeStation:number;
  private waitEnterTerminal:number;
  private state:State;
  private _doneFlag:boolean = false;

  constructor(stopPoints:number[], initPoint: number, options: SimpleAccelerationTrainOptions = {}){
    super(stopPoints, initPoint);

    // Stop points
    // All stations where this train stops
    // This allows flexibility and things like finishing at a certain terminal
    // Or skipping certain stations.
    // Note that the terminal (initial) station can also be skipped
    // (don't take passengers there and go straight to a certain station and then
    // continue the trip)
    // The stop points can't be changed after it begins.

    this.nextStopPoint = initPoint+1;

    this.speed = 0;

    this.maxSpeed = typeof options.maxSpeed !== "undefined"? options.maxSpeed : MAX_SPEED_DEFAULT;
    this.acceleration = typeof options.acceleration !== "undefined"? options.acceleration : ACCELERATION_DEFAULT;
    this.maxWaitTime = typeof options.maxWaitTime !== "undefined"? options.maxWaitTime : MAX_WAIT_TIME; // fixed, although it could have some randomizing and depending on how big the station is it could take a bit more
    this.waitEnterTerminal = typeof options.waitEnterTerminal !== "undefined"? options.waitEnterTerminal : WAIT_ENTER_TERMINAL;

    // PARECE que lo de saltarse la primera estacion se puede hacer colocando el estado altiro en MOVING
    // para recoger gente en la primera estacion hay que empezar en estado sin moverse
    this.state = options.skipFirstTerminal === true? State.MOVING : State.STOPPED_AT_STATION;
    this.currentWaitTimeStation = this.maxWaitTime;
  }

  public get doneFlag(){
    return this._doneFlag;
  }

  private shouldDeaccelerate(): boolean{

    let to = this.signalStopPoint;

    if(to === Infinity) return false;

    let currPos = this.currentPos;
    let currSpeed = this.speed;

    while(true){
      currSpeed -= this.acceleration;
      if(currSpeed <= 0) break;
      currPos += currSpeed;
    }

    return currPos >= to;
  }


  private stateAccelerating(){
    console.log("(currPos "+this._currentPos+", speed: "+this.speed+")")

    let accel = this.acceleration;
    accel *= this.shouldDeaccelerate()? -1 : 1;

    if(this.shouldDeaccelerate()) console.log("BAJANDO VELOCIDAD")

    let nextSpeed = this.speed + accel;
    nextSpeed = Math.min(nextSpeed, this.maxSpeed);
    nextSpeed = Math.max(nextSpeed, 0);

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
      this.speed = nextSpeed;
      this._currentPos += this.speed;
    }

    this.signalStopPoint = this.stopPoints[this.nextStopPoint];
  }

  private stateEnteringTerminal(){
    this.speed = 0;
    this.currentWaitTimeStation--;

    if(this.currentWaitTimeStation === 0){
      console.log(`Train exit`);
      this._doneFlag = true;
    }
  }

  private stateStoppedAtStation(){
    this.currentWaitTimeStation--;
    this.speed = 0;
    console.log("STopped, current pos: " + this._currentPos, "Wait time: ", this.currentWaitTimeStation)
    if(this.currentWaitTimeStation === 0){
      console.log(`train STARTS after being stopped`);
      this.state = State.MOVING;
    }
  }

  public update(){
    switch(this.state){
      case State.MOVING:
      this.stateAccelerating();
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
