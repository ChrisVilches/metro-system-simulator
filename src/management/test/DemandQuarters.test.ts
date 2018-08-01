import DemandQuarters from '../DemandQuarters';
import Time from '../Time';

const demand: DemandQuarters = new DemandQuarters([
  { hr: 8, quarters: [0, 2, 4, 6] },
  { hr: 9, quarters: [10, 20, 40, 5] }
]);

it('Gets average correctly', () => {
  expect(demand.getAverage(new Time(8, 0), new Time(8, 14))).toBe(0);
  expect(demand.getAverage(new Time(8, 0), new Time(8, 15))).toBe(1);
  expect(demand.getAverage(new Time(8, 0), new Time(8, 30))).toBe(2);
  expect(demand.getAverage(new Time(7, 0), new Time(8, 57))).toBe(1.5);
  expect(demand.getAverage(new Time(7, 0), new Time(11, 31))).toBeCloseTo(4.57894736842, 10);
});


it('Gets demand correctly', () => {
  expect(demand.getDemand(new Time(8, 3))).toBe(0);
  expect(demand.getDemand(new Time(8, 14))).toBe(0);
  expect(demand.getDemand(new Time(8, 15))).toBe(2);
  expect(demand.getDemand(new Time(8, 57))).toBe(6);
  expect(demand.getDemand(new Time(9, 0))).toBe(10);
  expect(demand.getDemand(new Time(9, 14))).toBe(10);
  expect(demand.getDemand(new Time(9, 15))).toBe(20);
  expect(demand.getDemand(new Time(9, 30))).toBe(40);
  expect(demand.getDemand(new Time(9, 57))).toBe(5);
});

it('Gets demand correctly when it does not exist (it returns 0)', () => {
  expect(demand.getDemand(new Time(10, 3))).toBe(0);
  expect(demand.getDemand(new Time(11, 14))).toBe(0);
  expect(demand.getDemand(new Time(12, 15))).toBe(0);
  expect(demand.getDemand(new Time(13, 57))).toBe(0);
  expect(demand.getDemand(new Time(14, 0))).toBe(0);
  expect(demand.getDemand(new Time(15, 14))).toBe(0);
  expect(demand.getDemand(new Time(16, 15))).toBe(0);
  expect(demand.getDemand(new Time(7, 30))).toBe(0);
  expect(demand.getDemand(new Time(6, 57))).toBe(0);
});
