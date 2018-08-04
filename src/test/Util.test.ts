import { Util } from "../Util";

it('Computes distance between points correctly', () => {
  expect(Util.getDistance({ lat: 0, lng: 0}, { lat: 0, lng: 1})).toBe(1);
  expect(Util.getDistance({ lat: 0, lng: 4}, { lat: 5, lng: 3})).toBeCloseTo(5.09902, 5);
  expect(Util.getDistance({ lat: 13.34, lng: 4}, { lat: 55.5656, lng: -2323.4})).toBeCloseTo(2327.78, 2);
  expect(Util.getDistance({ lat: 10, lng: 0}, { lat: 178, lng: 57})).toBeCloseTo(177.406313304, 8);
});
