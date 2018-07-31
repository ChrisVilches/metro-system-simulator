import Line from "./Line";
import Train from "./Train";
import IUpdatable from "./IUpdatable";
import * as _ from "lodash";
import HourMinute from "./HourMinute";
import Station from "./Station";
// Train dispatcher

// This algorithm could be different, modified, and implemented again in a completely different way

interface LineSegment{
  firstTerminal: number;
  secondTerminal: number;
}

interface TimeRange{
  firstTime: HourMinute,
  secondTime: HourMinute
}

interface DayPlanification{
  lineSegment: LineSegment;
  demandsPeriod: number[];
  innerTimer: number;
  currentTrains: Train[];
}

export default class Dispatcher implements IUpdatable{

  private line : Line;
  private initTime : HourMinute;
  private dangerDistance : number;
  private lineSegmentDayPlanification: DayPlanification[] = [];
  private direction: number;
  private periods: TimeRange[] = [];

  constructor(direction:number, initTime: HourMinute, line:any, schedules:HourMinute[]){
    this.line = line;
    this.direction = direction;
    this.initTime = initTime;
    this.dangerDistance = 500;

    for(let s=0; s<schedules.length-1; s++){
      this.periods.push({
        firstTime: schedules[s],
        secondTime: schedules[s+1],
      });
    }


    let lineSegments: LineSegment[] = this.getLineSegments();

    lineSegments.map(s => {

      let demands: number[] = [];

      this.periods.map(sch => { demands.push(this.getAverageSegmentDemand(s.firstTerminal, s.secondTerminal, sch)) });

      this.lineSegmentDayPlanification.push({
        lineSegment: s,
        demandsPeriod: demands, // Esto hay que ir actualizandolo por que puede que cambie de horario a medida que se ejecuta update()
        innerTimer: Infinity,
        currentTrains: []
      });
    });

  }

  public update(){

    // NOTESE que esto es solo para un terminal
    // Hay que pasar el arreglo de trenes a cada segmento, no dejarlo como un puro arreglo de trenes

    for(let dp in this.lineSegmentDayPlanification){

      let planification = this.lineSegmentDayPlanification[dp];

      let demand = planification.demandsPeriod[0]; // Get it using the time in the dispatcher (constructor argument)

      let trainEachMinutes = this.trainsPerMinute(demand);

      planification.innerTimer++;

      // El primer tren en realidad deberia salir al inicio del periodo de la estacion
      // pero en realidad uno puede simular desde cualquier hora, asi que el primer tren
      // deberia ser al mismo tiempo que parte la simulacion (siempre y cuando este dentro
      // del periodo de trenes disponibles firstTrainTime y lastTrainTime)

      planification.currentTrains = _.filter(planification.currentTrains, t => !t.doneFlag);
      let currTrains = planification.currentTrains;

      console.log("Amount of trains: " + currTrains.length)

      if(planification.innerTimer >= trainEachMinutes * 60){

        let accumDistances = [];
        for(let i in this.line.stations){
          accumDistances.push(this.line.getDistance(0, +i));
        }

        let phyiscalPosNewTrain: number = accumDistances[planification.lineSegment.firstTerminal];
        let noTrains = currTrains.length === 0;
        let safeDistance = !this.checkDanger(phyiscalPosNewTrain);

        if(noTrains || safeDistance){
          planification.innerTimer = 0;
          console.log("A new train is born");

          console.log("phpos" + phyiscalPosNewTrain)

          currTrains.push(new Train(accumDistances, planification.lineSegment.firstTerminal));
        } else {
          console.log("it's dangerous as fuck ("+currTrains.length+" trains in total), the time remains at " + planification.innerTimer);
        }

      }

      currTrains.map(t => t.update());

    }

    if(this.checkDanger()) throw Error("MUY CERCA!!!!!!!!!!");

    console.log();

  }

  private checkDanger(newTrainPhysicalPos:number = null){

    let allTrains: number[] = [];

    if(newTrainPhysicalPos !== null){
      allTrains.push(newTrainPhysicalPos);
    }

    let tooClose: Function = (t1: number, t2: number) => Math.abs(t1 - t2) < this.dangerDistance;

    for(let dp in this.lineSegmentDayPlanification){
      let trains = this.lineSegmentDayPlanification[dp].currentTrains;
      let positions = _.map(trains, 'currentPos');
      allTrains = allTrains.concat(positions);
    }

    for(let i=0; i<allTrains.length; i++){
      for(let j=i+1; j<allTrains.length; j++){
        if(tooClose(allTrains[i], allTrains[j])) return true;
      }
    }

    return false;
  }


  private trainsPerMinute(demand:number){
    return 10 - (0.09 * demand);
  }


  private getAverageSegmentDemand(from:number, to:number, period:TimeRange): number{

    let schedules = [];

    for(let s=from; s<=to; s++){

      let currentStation = this.line.stations[s];

      let average = currentStation
      .demand[this.direction]
      .getAverage(period.firstTime, period.secondTime);
      schedules.push(average);
    }

    let accum = 0;
    let n = 0;
    schedules.map(v => { n++; accum += v });

    return accum/n;
  }


  private getLineSegments(): LineSegment[]{

    let stations: Station[] = this.line.stations;
    let segments: LineSegment[] = [];

    let first = 0; // First one is always a terminal

    for(let i=1; i<stations.length; i++){

      let s = stations[i];

      if(s.isTerminal){
        segments.push({
          firstTerminal: first,
          secondTerminal: i
        });
        first = i;
      }
    }
    return segments;
  }


}
