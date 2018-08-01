import Line from '../Line';
import Station from '../Station';
import DemandQuarters from '../DemandQuarters';
import TimeRange from '../TimeRange';
import Time from '../Time';
import LineSegment from '../LineSegment';
import Train from '../Train';

const demand1 = new DemandQuarters([
  { hr: 8, quarters: [10, 40, 70, 80]  },
  { hr: 9, quarters: [80, 85, 79, 80]  }
]);

const st1: Station = new Station([demand1, demand1], new TimeRange(new Time(8, 4), new Time(10, 3)));
const st2: Station = new Station([demand1, demand1]);
const st3: Station = new Station([demand1, demand1]);
const st4: Station = new Station([demand1, demand1]);
const st5: Station = new Station([demand1, demand1], new TimeRange(new Time(8, 4), new Time(10, 3)));
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
  let t1 = new Train([10, 20], 0);
  let t2 = new Train([15, 20], 1);
  expect(line.isDangerous([t1, t2], 4)).toBe(false);
  expect(line.isDangerous([t1, t2], 5)).toBe(false);
  expect(line.isDangerous([t1, t2], 9)).toBe(false);
  expect(line.isDangerous([t1, t2], 10)).toBe(false);
  expect(line.isDangerous([t1, t2], 11)).toBe(true);
  expect(line.isDangerous([t1, t2], 50)).toBe(true);
});

it('Detect when it is dangerous (#2)', () => {
  let line: Line = new Line([st1], []);
  let t1 = new Train([10], 0);
  let t2 = new Train([15], 0);
  let t3 = new Train([50], 0);
  let t4 = new Train([70], 0);
  expect(line.isDangerous([t1, t2], 5)).toBe(false);
  expect(line.isDangerous([t1, t2], 6)).toBe(true);
  expect(line.isDangerous([t1, t3], 40)).toBe(false);
  expect(line.isDangerous([t1, t2], 41)).toBe(true);
  expect(line.isDangerous([t2, t3], 35)).toBe(false);
  expect(line.isDangerous([t2, t3], 36)).toBe(true);
  expect(line.isDangerous([t3, t2], 35)).toBe(false);
  expect(line.isDangerous([t3, t2], 36)).toBe(true);
  expect(line.isDangerous([t4, t1], 59)).toBe(false);
  expect(line.isDangerous([t4, t1], 60)).toBe(false);
  expect(line.isDangerous([t4, t1], 61)).toBe(true);
});
