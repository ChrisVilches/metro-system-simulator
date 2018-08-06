import * as _ from "lodash";
import IDemand from "./IDemand";
import Time from "./Time";


export interface DemandQuartersArgument{
  hr: number;
  quarters: number[];
}

export class DemandQuarters implements IDemand{

  private _quarters: DemandQuartersArgument[];

  constructor(times: DemandQuartersArgument[]){
    this._quarters = _.cloneDeep(times);
    for(let i=0; i<this._quarters.length; i++){

      for(let j=0; j<4; j++){
        let random = (Math.random()*5) + 3;
        this._quarters[i].quarters[j] += Math.round(random);
        if(this._quarters[i].quarters[j] > 100) this._quarters[i].quarters[j] = 100;
        if(this._quarters[i].quarters[j] < 0) this._quarters[i].quarters[j] = 0;
      }
    }
  }

  public getDemand(time: Time){

    let hr = time.hr;
    let min = time.min;

    if(hr < 0 || hr > 23) throw Error("Hour must be between 0 and 23");
    if(min < 0 || min > 59) throw Error("Minutes must be between 0 and 59");

    for(let i in this._quarters){
      if(this._quarters[i].hr === hr){
        let q = Math.floor(min/15);
        return this._quarters[i].quarters[q];
      }
    }
    return 0;
  }

  public getAverage(a: Time, b: Time){

    let quarter1 = Math.floor(a.min/15);
    let quarter2 = Math.floor(b.min/15);

    let accum = 0;
    let n = 0;

    for(let h=a.hr; h<=b.hr; h++){

      let firstQuarter = h === a.hr? quarter1 : 0;
      let lastQuarter = h === b.hr? quarter2 : 3;

      for(let q=firstQuarter; q<=lastQuarter; q++){
        n++;
        accum += this.getDemand(new Time(h, q * 15));
      }
    }


    let average = accum/n;
    return average;
  }

}
