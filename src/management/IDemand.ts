import Time from "./Time";

export default interface IDemand {
  getDemand(time: Time):number;
  getAverage(a: Time, b: Time):number;
}
