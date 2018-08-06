import { Line, LineSegment } from '../Line';
import Station from '../Station';
import { DemandQuarters, DemandQuartersArgument } from '../DemandQuarters';
import TimeRange from '../TimeRange';
import Time from '../Time';
import { Train } from '../Train';
import { SimpleAccelerationTrain, SimpleAccelerationTrainOptions } from '../SimpleAccelerationTrain';

const demand1 = new DemandQuarters([
  { hr: 8, quarters: [10, 40, 70, 80]  },
  { hr: 9, quarters: [80, 85, 79, 80]  }
]);

const demand2 = new DemandQuarters([
  { hr: 8, quarters: [80, 10, 80, 100]  },
  { hr: 9, quarters: [70, 20, 10, 30]  }
]);

const st1: Station = new Station([demand1, demand1], new TimeRange(new Time(8, 4), new Time(10, 3)));
const st2: Station = new Station([demand1, demand1]);
const st3: Station = new Station([demand1, demand1]);
const st4: Station = new Station([demand1, demand1]);
const st5: Station = new Station([demand2, demand1], new TimeRange(new Time(8, 4), new Time(10, 3)));
const st6: Station = new Station([demand1, demand1]);
const st7: Station = new Station([demand1, demand1]);
const st8: Station = new Station([demand1, demand1], new TimeRange(new Time(8, 4), new Time(10, 3)));
const st9: Station = new Station([demand1, demand1], new TimeRange(new Time(8, 4), new Time(10, 3)));

it('Calculates distance between stations correctly', () => {
  let distanceFromPrev = [10, 30, 40, 20];
  let line: Line = new Line([st1, st2, st3, st4, st5], distanceFromPrev);
  expect(line.getDistance(0, 0)).toBe(0);
  expect(line.getDistance(0, 1)).toBe(10);
  expect(line.getDistance(0, 2)).toBe(40);
  expect(line.getDistance(1, 0)).toBe(10);
  expect(line.getDistance(1, 1)).toBe(0);
  expect(line.getDistance(1, 2)).toBe(30);
  expect(line.getDistance(1, 4)).toBe(90);
});

it('Calculates full length correctly', () => {
  let distanceFromPrev = [10, 30, 40, 20];
  let line: Line = new Line([st1, st2, st3, st4, st5], distanceFromPrev);
  expect(line.fullLength).toBe(100);
});

it('Calculates line segments (between terminals) correctly (only one segment)', () => {
  let distanceFromPrev = [10, 30, 40, 20];
  let line: Line = new Line([st1, st2, st3, st4, st5], distanceFromPrev);
  expect(line.getLineTerminalSegments()).toEqual([{ firstTerminal: 0, secondTerminal: 4 }]);
});

it('Calculates line segments (between terminals) correctly (two segments)', () => {
  let distanceFromPrev = [10, 30, 40, 20, 10, 12, 13];
  let line: Line = new Line([st1, st2, st3, st4, st5, st6, st7, st8], distanceFromPrev);
  expect(line.getLineTerminalSegments()).toEqual([{ firstTerminal: 0, secondTerminal: 4 }, { firstTerminal: 4, secondTerminal: 7 }]);
});

it('Calculates line segments (between terminals) correctly (three segments, one terminal next to another)', () => {
  let distanceFromPrev = [10, 30, 40, 20, 10, 12, 13, 14];
  let line: Line = new Line([st1, st2, st3, st4, st5, st6, st7, st8, st9], distanceFromPrev);
  expect(line.getLineTerminalSegments()).toEqual([
    { firstTerminal: 0, secondTerminal: 4 },
    { firstTerminal: 4, secondTerminal: 7 },
    { firstTerminal: 7, secondTerminal: 8 }
  ]);
});

it('Detect when it is dangerous (#1)', () => {
  let line: Line = new Line([st1], []);
  let t1: Train = new SimpleAccelerationTrain([10, 20], 0);
  let t2: Train = new SimpleAccelerationTrain([15, 20], 1);
  expect(line.isDangerous([t1, t2], 4)).toBe(null);
  expect(line.isDangerous([t1, t2], 5)).toBe(null);
  expect(line.isDangerous([t1, t2], 9)).toBe(null);
  expect(line.isDangerous([t1, t2], 10)).toBe(null);
  expect(line.isDangerous([t1, t2], 11)).toEqual([0, 1]);
  expect(line.isDangerous([t1, t2], 50)).toEqual([0, 1]);
});

it('Detect when it is dangerous (#2)', () => {
  let line: Line = new Line([st1], []);
  let t1: Train = new SimpleAccelerationTrain([10], 0);
  let t2: Train = new SimpleAccelerationTrain([15], 0);
  let t3: Train = new SimpleAccelerationTrain([50], 0);
  let t4: Train = new SimpleAccelerationTrain([70], 0);
  expect(line.isDangerous([t1, t2], 5)).toBe(null);
  expect(line.isDangerous([t1, t2], 6)).toEqual([0, 1]);
  expect(line.isDangerous([t1, t3], 40)).toBe(null);
  expect(line.isDangerous([t1, t2], 41)).toEqual([0, 1]);
  expect(line.isDangerous([t2, t3], 35)).toBe(null);
  expect(line.isDangerous([t2, t3], 36)).toEqual([0, 1]);
  expect(line.isDangerous([t3, t2], 35)).toBe(null);
  expect(line.isDangerous([t3, t2], 36)).toEqual([0, 1]);
  expect(line.isDangerous([t4, t1], 59)).toBe(null);
  expect(line.isDangerous([t4, t1], 60)).toBe(null);
  expect(line.isDangerous([t4, t1], 61)).toEqual([0, 1]);
});

it('Detect when it is dangerous (#3)', () => {
  let line: Line = new Line([st1], []);
  let t1: Train = new SimpleAccelerationTrain([10], 0);
  let t2: Train = new SimpleAccelerationTrain([15], 0);
  let t3: Train = new SimpleAccelerationTrain([50], 0);
  let t4: Train = new SimpleAccelerationTrain([70], 0);
  expect(line.isDangerous([t1, t2], 5)).toBe(null);
  expect(line.isDangerous([t1, t2], 6)).toEqual([0, 1]);
  expect(line.isDangerous([t1, t3], 40)).toBe(null);
  expect(line.isDangerous([t1, t2], 41)).toEqual([0, 1]);
  expect(line.isDangerous([t2, t3], 35)).toBe(null);
  expect(line.isDangerous([t2, t3], 36)).toEqual([0, 1]);
  expect(line.isDangerous([t3, t2], 35)).toBe(null);
  expect(line.isDangerous([t3, t2], 36)).toEqual([0, 1]);
  expect(line.isDangerous([t4, t1], 59)).toBe(null);
  expect(line.isDangerous([t4, t1], 60)).toBe(null);
  expect(line.isDangerous([t4, t1], 61)).toEqual([0, 1]);
});


it('Gets average demand correctly', () => {
  let line: Line = new Line([st1, st5], [110, 100]);
  let avg;
  avg = line.getAverageSegmentDemand(0, 1, 0, new TimeRange(new Time(8, 0), new Time(8, 59)));
  expect(avg).toBe(58.75);

  avg = line.getAverageSegmentDemand(0, 1, 0, new TimeRange(new Time(8, 15), new Time(9, 30)));
  expect(avg).toBeCloseTo(60.3333333333, 10);

});
