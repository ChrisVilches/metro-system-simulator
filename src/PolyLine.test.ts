import PolyLine from "./PolyLine";

it('Gets point inside line correctly (one segment)', () => {

  let line: PolyLine = new PolyLine([
    { lat: 0, lng: 0 },
    { lat: 10, lng: 0 }
  ]);

  expect(line.getPointWithinRoute(0)).toEqual({ lat: 0, lng: 0 });
  expect(line.getPointWithinRoute(0.5)).toEqual({ lat: 5, lng: 0 });
  expect(line.getPointWithinRoute(0.9999)).toEqual({ lat: 9.999, lng: 0 });
  expect(line.getPointWithinRoute(1)).toEqual({ lat: 10, lng: 0 });
  expect(line.getPointWithinRoute(1.2)).toEqual({ lat: 10, lng: 0 });

});


it('Gets point inside line correctly (two segment #1)', () => {

  let line: PolyLine = new PolyLine([
    { lat: 0, lng: 0 },
    { lat: 10, lng: 0 },
    { lat: 10, lng: 50 }
  ]);

  expect(line.getPointWithinRoute(0)).toEqual({ lat: 0, lng: 0 });
  expect(line.getPointWithinRoute(1)).toEqual({ lat: 10, lng: 50 });
  expect(line.getPointWithinRoute(0.5)).toEqual({ lat: 10, lng: 20 });
  expect(line.getPointWithinRoute(1/6)).toEqual({ lat: 10, lng: 0 });
});

it('Gets point inside line correctly (three segment #2)', () => {

  let line: PolyLine = new PolyLine([
    { lat: 0, lng: 0 },
    { lat: 5, lng: 10 },
    { lat: 10, lng: 0 }
  ]);

  expect(line.getPointWithinRoute(0)).toEqual({ lat: 0, lng: 0 });
  expect(line.getPointWithinRoute(0.5)).toEqual({ lat: 5, lng: 10 });
  expect(line.getPointWithinRoute(1)).toEqual({ lat: 10, lng: 0 });
  expect(line.getPointWithinRoute(0.25)).toEqual({ lat: 2.5, lng: 5 });
  expect(line.getPointWithinRoute(0.75)).toEqual({ lat: 7.5, lng: 5 });
});

it('Gets point inside line correctly (two segment #3)', () => {

  let line: PolyLine = new PolyLine([
    { lat: 0, lng: 0 },
    { lat: 10, lng: 0 },
    { lat: 178, lng: 57 }
  ]);

  let result;

  expect(line.getPointWithinRoute(0)).toEqual({ lat: 0, lng: 0 });
  expect(line.getPointWithinRoute(1)).toEqual({ lat: 178, lng: 57 });

  result = line.getPointWithinRoute(0.05335999531);
  expect(result.lat).toBeCloseTo(10, 8);
  expect(result.lng).toBe(0);

  result = line.getPointWithinRoute(0.04);
  expect(result.lat).toBeCloseTo(7.49625253294, 8);
  expect(result.lng).toBe(0);

  result = line.getPointWithinRoute(0.52667999765);
  expect(result.lat).toBeCloseTo(94, 8);
  expect(result.lng).toBeCloseTo(28.5, 9);

  result = line.getPointWithinRoute(0.5);
  expect(result.lat).toBeCloseTo((168*0.4718161101096702)+10, 10);
  expect(result.lng).toBeCloseTo(0.47181611011 * 57, 10);

});


it('Gets point inside line correctly (two segment #4)', () => {

  let line: PolyLine = new PolyLine([
    { lat: 0, lng: 0 },
    { lat: 10, lng: 0 },
    { lat: 30, lng: 50 }
  ]);

  let result;

  result = line.getPointWithinRoute(0.5);
  expect(result.lat).toBeCloseTo(8.1430466184 + 10, 4);
  expect(result.lng).toBeCloseTo(20.357616546, 4);


});
