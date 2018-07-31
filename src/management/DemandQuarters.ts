import * as _ from "lodash";
import IDemand from "./IDemand";
import HourMinute from "./HourMinute";

export default class DemandQuarters implements IDemand{

  private _quarters: any;

  constructor(times:any = null){

    if(times === null){
      throw Error("Argument cannot be null");
    }

    this._quarters = _.cloneDeep(times);

  }

  public getDemand(time: HourMinute){

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

  public getAverage(a: HourMinute, b: HourMinute){

    let quarter1 = Math.floor(a.min/15);
    let quarter2 = Math.floor(b.min/15);

    let accum = 0;
    let n = 0;

    for(let h=a.hr; h<b.hr; h++){

      let firstQuarter = h === a.hr? quarter1 : 0;
      let lastQuarter = h === b.hr? quarter2 : 4;

      for(let q=firstQuarter; q<lastQuarter; q++){
        n++;
        accum += this.getDemand({ hr: h, min: q });
      }
    }

    let average = accum/n;
    return average;
  }

}




/*
* TEST
*
*/
/*
let demand = new Demand([
  { hr: 8, quarters: [10, 40, 70, 80]  },
  { hr: 9, quarters: [80, 85, 79, 80]  },
  { hr: 10, quarters: [80, 70, 60, 50]  },
  { hr: 11, quarters: [40, 30, 35, 32]  },
  { hr: 12, quarters: [30, 35, 32, 34]  },
  { hr: 13, quarters: [30, 45, 35, 34]  },
  { hr: 14, quarters: [30, 35, 33, 34]  },
  { hr: 15, quarters: [30, 35, 32, 34]  },
  { hr: 16, quarters: [30, 35, 32, 34]  },
  { hr: 17, quarters: [30, 35, 32, 34]  },
  { hr: 18, quarters: [80, 85, 79, 80]  },
  { hr: 19, quarters: [82, 87, 79, 72]  },
  { hr: 20, quarters: [80, 85, 79, 80]  },
  { hr: 21, quarters: [10, 40, 70, 80]  },
  { hr: 22, quarters: [10, 5, 8, 13]  }
]);


console.assert(demand.getDemand(8, 30) === 70);
console.assert(demand.getDemand(8, 29) === 40);
*/
