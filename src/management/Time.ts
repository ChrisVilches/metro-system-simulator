export default class Time{
  public hr: number = 0;
  public min: number = 0;
  public sec: number = 0;

  constructor(hr?:number, min?:number, sec?:number){
    if(typeof hr !== 'undefined') this.hr = hr;
    if(typeof min !== 'undefined') this.min = min;
    if(typeof sec !== 'undefined') this.sec = sec;
  }

  greaterThan(o: Time){
    if(this.hr !== o.hr) return this.hr > o.hr;
    if(this.min !== o.min) return this.min > o.min;
    if(this.sec !== o.sec) return this.sec > o.sec;
    return false;
  }

  lessThan(o: Time){
    return o.greaterThan(this);
  }

  equal(o: Time){
    if(this.hr !== o.hr) return false
    if(this.min !== o.min) return false
    if(this.sec !== o.sec) return false
    return true;
  }

}
