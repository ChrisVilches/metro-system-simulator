import { LinePhysical, LineFactoryPhysicalPoint, LineFactory } from "../LinePhysical";
import IDemand from "../management/IDemand";
import { DemandQuarters, DemandQuartersArgument } from '../management/DemandQuarters';
import TimeRange from "../management/TimeRange";
import Time from "../management/Time";
import { Line } from "../management/Line";

const dmnd: DemandQuarters = new DemandQuarters([
  { hr: 8, quarters: [0, 2, 4, 6] },
  { hr: 9, quarters: [10, 20, 40, 5] }
]);

const timeRange: TimeRange = new TimeRange(new Time(8, 0), new Time(23, 0));

it('Creates a line correctly', () => {

  let points: LineFactoryPhysicalPoint[] = [
    { lat: 0, lng: 0, station: "A", isTerminal: true, demands: [dmnd, dmnd], timeRange: timeRange },
    { lat: 0, lng: 2 },
    { lat: 2, lng: 2, station: "B", demands: [dmnd, dmnd] },
    { lat: 2, lng: 0, station: "C", isTerminal: true, demands: [dmnd, dmnd], timeRange: timeRange }
  ];

  let lineFactory = new LineFactory();
  let line: Line = lineFactory.fromPhysicalPoints(points, 100);

  expect(line.stations.length).toBe(3);
  expect(line.getLineTerminalSegments()).toEqual([{ firstTerminal: 0, secondTerminal: 2 }]);
  expect(line.fullLength).toBe(600);
  expect(line.getDistance(0, 1)).toBe(400);

});
