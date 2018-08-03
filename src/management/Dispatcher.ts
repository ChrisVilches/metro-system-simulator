import { Line, LineSegment } from "./Line";
import { Train, TrainState } from "./Train";
import { SimpleAccelerationTrain, SimpleAccelerationTrainOptions } from "./SimpleAccelerationTrain";
import IUpdatable from "./IUpdatable";
import * as _ from "lodash";
import Station from "./Station";
import TimeRange from "./TimeRange";
import Time from "./Time";


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
  private stationsPointMapping: number[] = [];

  constructor(direction:number, line:Line, schedules:Time[]){
    this.line = line;
    this.direction = direction;
    this.dangerDistance = 200;

    for(let s=0; s<schedules.length-1; s++){
      this.periods.push({
        firstTime: schedules[s],
        secondTime: schedules[s+1],
      });
    }

    let lineSegments: LineSegment[] = this.line.getLineTerminalSegments();

    lineSegments.map(s => {

      let demands: number[] = [];

      this.periods.map(sch => { demands.push(this.line.getAverageSegmentDemand(s.firstTerminal, s.secondTerminal, this.direction, sch)) });

      this.lineSegmentDayPlanification.push({
        lineSegment: s,
        demandsPeriod: demands, // Esto hay que ir actualizandolo por que puede que cambie de horario a medida que se ejecuta update()
        tick: 0,
        currentTrains: [],
        hasDispatchedTrainYet: false
      });
    });

    for(let i in this.line.stations){
      this.stationsPointMapping.push(this.line.getDistance(0, +i));
    }

    console.log((this.stationsPointMapping));
  }

  public get trains(): Train[]{
    let trains: Train[] = [];
    for(let i in this.lineSegmentDayPlanification){
      trains = trains.concat(this.lineSegmentDayPlanification[i].currentTrains);
    }
    return _.sortBy(trains, t => t.currentPos);
  }

  public update(){

    // NOTESE que esto es solo para un terminal
    // Hay que pasar el arreglo de trenes a cada segmento, no dejarlo como un puro arreglo de trenes

    for(let dp=0; dp<this.lineSegmentDayPlanification.length; dp++){

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

        let previousTrain_index: number;
        let nextTrain_index: number;

        let previousTrain: Train = null;
        let nextTrain: Train = null;
        let newPossibleTrain: Train = new SimpleAccelerationTrain(this.stationsPointMapping, planification.lineSegment.firstTerminal);

        let allTrains = this.trains;

        /*for(let i=0; i<allTrains.length-1; i++){

          if(allTrains[i].currentPos < allTrains[i+1].currentPos){

          } else {
            //console.log(allTrains)
            //debugger;
          }

        }*/

        for(let t=0; t<allTrains.length; t++){
          if(allTrains[t].currentPos >= newPossibleTrain.currentPos){
            nextTrain = allTrains[t];
            nextTrain_index = t;
            break;
          }
        }

        for(let t=allTrains.length-1; t>=0; t--){
          if(allTrains[t].currentPos <= newPossibleTrain.currentPos){
            previousTrain = allTrains[t];
            previousTrain_index = t;
            break;
          }
        }

      /*  if(nextTrain !== null) console.assert(nextTrain.currentPos >= newPossibleTrain.currentPos);
        if(previousTrain !== null) console.assert(previousTrain.currentPos <= newPossibleTrain.currentPos);
*/


        //if(previousTrain !== null && nextTrain !== null){

          /*console.log(previousTrain_index)
          console.log(nextTrain_index)
          console.log(previousTrain)
          console.log(newPossibleTrain)
          console.log(nextTrain)*/

          //console.assert(previousTrain_index === nextTrain_index - 1 || previousTrain_index === nextTrain_index);
          /*let asserted = false;
          for(let i=0; i<allTrains.length-1; i++){
            if(i === previousTrain_index){
              console.assert(i+1 === nextTrain_index);
              asserted = true;
              break;
            }
          }
          if(!asserted) console.log("NO HUBO UNA ASERCION!!!!!!!!")
          console.assert(asserted);*/
        //}

        /*for(let i=0; i<this.trains.length-1; i++){

          if(this.trains[i].currentPos < this.trains[i+1].currentPos){

          } else {
            let st=-1;
            for(let j=0; j<this.stationsPointMapping.length; j++){
              if(this.stationsPointMapping[j] === this.trains[i].currentPos){
                st=j;
                break;
              }
            }
            console.log(`(Station ${st}) Error lol ${this.trains[i].currentPos} ${this.trains[i+1].currentPos}`)
            //alert(this.trains[i].currentState)
            //alert(this.trains[i+1].currentState)
          }

        }*/

        let adjacentTrains: Train[] = [];

        if(previousTrain !== null) adjacentTrains.push(previousTrain);
        adjacentTrains.push(newPossibleTrain);
        if(nextTrain !== null) adjacentTrains.push(nextTrain);

        if(this.checkDanger(adjacentTrains, this.dangerDistance) === null){
          planification.tick = 0;
          //console.log("A new train is born");
          planification.hasDispatchedTrainYet = true;
          currTrains.push(newPossibleTrain);


        } else {
          //console.log("it's dangerous as fuck ("+currTrains.length+" trains in total, segment="+dp+"), the time remains at " + planification.tick);
        }

      }

      currTrains.map(t => {
        this.signalSafeDistance();
        t.update();
      });

    }

    /*let trainsDanger: number[] = this.checkDanger(this.trains, this.dangerDistance);

    if(trainsDanger !== null){
      //console.log(`Muy cerca pero solo para la opinion de este dispatcher!!!!!!!!!! trenes indices ${trainsDanger[0]}, ${trainsDanger[1]}`);
    }*/


  }

  private signalSafeDistance(){
    let allTrains: Train[] = [];

    this.lineSegmentDayPlanification.map(seg => {
      allTrains = allTrains.concat(seg.currentTrains);
    });

    allTrains = _.sortBy(allTrains, (t: Train) => t.currentPos);

    for(let i=0; i<allTrains.length-1; i++){
      let t = allTrains[i];
      let next = allTrains[i+1];

      let safePos = next.currentPos - this.dangerDistance;
      t.signalStop(safePos);
      t.signalStop(next.currentPos);
    }
  }


  private checkDanger(trains: Train[], maximumDistanceAllowed: number): number[]{
    return this.line.isDangerous(trains, maximumDistanceAllowed);
  }


  private trainsPerMinute(demand:number){
    return 0.2;
    return 10 - (0.09 * demand);
  }

  public getEstimatedTimes(){
    let disp: Dispatcher = _.cloneDeep(this);

    let existingStations = this.stationsPointMapping.map(x => { return { station: x, arrivals: [] } });

    for(let i=0; i<50000; i++){

      let x = 0;
      for(; x<existingStations.length; x++){
        if(existingStations[x].arrivals.length === 0) break;
      }

      if(x === existingStations.length) break;

      let trains: Train[] = disp.trains;
      for(let j=0; j<trains.length; j++){
        let t = trains[j];
        if(t.currentState === TrainState.STOPPED_AT_STATION || t.currentState === TrainState.ENTERING_TERMINAL){
          let stIndex = _.findIndex(existingStations, s => s.station === t.currentPos); // Binary search, maybe?
          if(existingStations[stIndex].arrivals.length === 0 || _.last(existingStations[stIndex].arrivals).train !== t){
            existingStations[stIndex].arrivals.push({ time: i, train: t });
          }
        }
      }

      disp.update();
    }

    return existingStations.map(x => x.arrivals).map(y => y.map(z => z.time));

  }




}
