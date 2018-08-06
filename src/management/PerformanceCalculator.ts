import { Train } from "./Train";
import Dispatcher from "./Dispatcher";

export enum MonitorState{
  OK,
  DANGEROUS_SCHEDULING,
  TRAIN_COLLISION
}

export class PerformanceCalculator{

  private _safeDistance: number = 200;

  private _dispatcher: Dispatcher;

  constructor(dispatcher: Dispatcher){
    this._dispatcher = dispatcher;


    console.assert(
      PerformanceCalculator.demandSatisfied(4, 50) > PerformanceCalculator.demandSatisfied(8, 50) &&
      PerformanceCalculator.demandSatisfied(1, 50) > PerformanceCalculator.demandSatisfied(4, 50)
    );

    /*console.assert(PerformanceCalculator.idealSupply(0) === 30);
    console.assert(PerformanceCalculator.idealSupply(5) === 20);
    console.assert(PerformanceCalculator.idealSupply(10) === 10);
    console.assert(PerformanceCalculator.idealSupply(30) === 6.5);
    console.assert(PerformanceCalculator.idealSupply(50) === 3);
    console.assert(PerformanceCalculator.idealSupply(75) === 2.25);
    console.assert(PerformanceCalculator.idealSupply(100) === 1.5);

    console.assert(PerformanceCalculator.idealTrainsAvgMinute(30) === 0);
    console.assert(PerformanceCalculator.idealTrainsAvgMinute(20) === 5);
    console.assert(PerformanceCalculator.idealTrainsAvgMinute(10) === 10);
    console.assert(PerformanceCalculator.idealTrainsAvgMinute(6.5) === 30);
    console.assert(PerformanceCalculator.idealTrainsAvgMinute(3) === 50);
    console.assert(PerformanceCalculator.idealTrainsAvgMinute(2.25) === 75);
    console.assert(PerformanceCalculator.idealTrainsAvgMinute(1.5) === 100);*/
  }

  public computeDanger(): number{

    let trains: Train[] = this._dispatcher.trains;

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

  public get dispatcher(){
    return this._dispatcher;
  }

  static point1 = [0, 40];
  static point2 = [10, 20];
  static point3 = [50, 1.6];
  static point4 = [100, 1.3];

  private static idealSupply(currentDemand: number): number{

    // (100,1.5), (50,3), (10,10), (0, 60)

    let pt1, pt2;

    let between = (a, b) => a <= currentDemand && currentDemand <= b;

    if(between(0, 10)){
      pt1 = PerformanceCalculator.point1;
      pt2 = PerformanceCalculator.point2;
    } else if(between(10, 50)){
      pt1 = PerformanceCalculator.point2;
      pt2 = PerformanceCalculator.point3;
    } else {
      pt1 = PerformanceCalculator.point3;
      pt2 = PerformanceCalculator.point4;
    }

    let slope = (pt2[1] - pt1[1])/(pt2[0] - pt1[0]);
    let dx = currentDemand - pt1[0];
    let result = pt1[1] + (dx * slope);
    return result;

  }



  public static demandSatisfied(trainsEveryAvgMinute: number, currentDemand: number): number{

    let ideal = PerformanceCalculator.idealSupply(currentDemand);

    ideal = PerformanceCalculator.point1[1] - ideal;
    let current = PerformanceCalculator.point1[1] - trainsEveryAvgMinute;

    if(ideal === 0) return 1;

    return current/ideal;
  }


  /*public get safeDistance(){
    return this._safeDistance;
  }

  public set safeDistance(d: number){
    this._safeDistance = d;
  }*/

}
