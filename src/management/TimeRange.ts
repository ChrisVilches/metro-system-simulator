import Time from "./Time";

export default class TimeRange{
  firstTime: Time;
  secondTime: Time;

  constructor(a: Time, b: Time){
    this.firstTime = a;
    this.secondTime = b;
  }

}
