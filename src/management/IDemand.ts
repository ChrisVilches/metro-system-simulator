import HourMinute from "./HourMinute";

export default interface IDemand {
  getDemand(time: HourMinute):number;
  getAverage(a: HourMinute, b: HourMinute):number;
}
