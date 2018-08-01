import { Line, LineSegment } from "./Line";
import Train from "./Train";
import IUpdatable from "./IUpdatable";
import * as _ from "lodash";
import Station from "./Station";
import TimeRange from "./TimeRange";
import Time from "./Time";

// Train dispatcher

// This algorithm could be different, modified, and implemented again in a completely different way


interface DayPlanification{
  lineSegment: LineSegment;
  demandsPeriod: number[];
  tick: number;
  currentTrains: Train[];
  hasDispatchedTrainYet: boolean;
}

export default class Dispatcher implements IUpdatable{

  private line : Line;
  private dangerDistance : number;
  private lineSegmentDayPlanification: DayPlanification[] = [];
  private direction: number;
  private periods: TimeRange[] = [];

  constructor(direction:number, line:any, schedules:Time[]){
    this.line = line;
    this.direction = direction;
    this.dangerDistance = 500;

    for(let s=0; s<schedules.length-1; s++){
      this.periods.push({
        firstTime: schedules[s],
        secondTime: schedules[s+1],
      });
    }


    let lineSegments: LineSegment[] = this.line.getLineTerminalSegments();

    lineSegments.map(s => {

      let demands: number[] = [];

      this.periods.map(sch => { demands.push(this.getAverageSegmentDemand(s.firstTerminal, s.secondTerminal, sch)) });

      this.lineSegmentDayPlanification.push({
        lineSegment: s,
        demandsPeriod: demands, // Esto hay que ir actualizandolo por que puede que cambie de horario a medida que se ejecuta update()
        tick: 0,
        currentTrains: [],
        hasDispatchedTrainYet: false
      });
    });

  }

  public get trains(): Train[]{
    let trains: Train[] = [];
    for(let i in this.lineSegmentDayPlanification){
      trains = trains.concat(this.lineSegmentDayPlanification[i].currentTrains);
    }
    return trains;
  }

  public update(){

    // NOTESE que esto es solo para un terminal
    // Hay que pasar el arreglo de trenes a cada segmento, no dejarlo como un puro arreglo de trenes

    for(let dp in this.lineSegmentDayPlanification){

      let planification = this.lineSegmentDayPlanification[dp];

      let demand = planification.demandsPeriod[0]; // Get it using the time in the dispatcher (constructor argument)

      let trainEachMinutes = this.trainsPerMinute(demand);

      planification.tick++;

      // El primer tren en realidad deberia salir al inicio del periodo de la estacion
      // pero en realidad uno puede simular desde cualquier hora, asi que el primer tren
      // deberia ser al mismo tiempo que parte la simulacion (siempre y cuando este dentro
      // del periodo de trenes disponibles firstTrainTime y lastTrainTime)

      planification.currentTrains = _.filter(planification.currentTrains, t => !t.doneFlag);
      let currTrains = planification.currentTrains;

      if(planification.tick >= trainEachMinutes * 60 || planification.hasDispatchedTrainYet === false){

        let accumDistances = [];
        for(let i in this.line.stations){
          accumDistances.push(this.line.getDistance(0, +i));
        }

        let newPossibleTrain = new Train(accumDistances, planification.lineSegment.firstTerminal);
        let phyiscalPosNewTrain: number = accumDistances[planification.lineSegment.firstTerminal];
        let noTrains = currTrains.length === 0;
        let safeDistance = !this.checkDanger(this.dangerDistance, newPossibleTrain);

        if(noTrains || safeDistance){
          planification.tick = 0;
          console.log("A new train is born");
          planification.hasDispatchedTrainYet = true;
          currTrains.push(newPossibleTrain);
        } else {
          console.log("it's dangerous as fuck ("+currTrains.length+" trains in total), the time remains at " + planification.tick);
        }

      }

      currTrains.map(t => t.update());

    }

    if(this.checkDanger(this.dangerDistance)) throw Error("MUY CERCA!!!!!!!!!!");

  }

  private checkDanger(maximumDistanceAllowed: number, extraTrain:Train = null){

    let allTrains: Train[] = [];

    if(extraTrain !== null){
      allTrains.push(extraTrain);
    }

    return this.line.isDangerous(allTrains, maximumDistanceAllowed);
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


}
