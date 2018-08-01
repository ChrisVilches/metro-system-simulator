import Train from '../Train';

it('Initial position set correctly', () => {

  let train: Train = new Train([10, 30, 500], 0);
  expect(train.currentPos).toBe(10);

});



it('It never goes back', () => {

  let train: Train = new Train([10, 30, 500], 0, { acceleration: 3, maxSpeed: 10 });
  expect(train.currentPos).toBe(10);
  train.update();
  expect(train.currentPos).toBe(13);
  train.update();
  expect(train.currentPos).toBe(19);
  train.update();
  expect(train.currentPos).toBe(28);
  train.update();
  expect(train.currentPos).toBe(30);
  train.update();
  expect(train.currentPos).toBe(30);
  train.update();

});


it('It always stops at its stop points', () => {

  let train: Train = new Train([10, 30, 500], 0, { acceleration: 3000000, maxSpeed: 300000, maxWaitTime: 1 });
  expect(train.currentPos).toBe(10);
  train.update();
  expect(train.currentPos).toBe(30);
  train.update();
  expect(train.currentPos).toBe(30);
  train.update();
  expect(train.currentPos).toBe(500);
  train.update();
  expect(train.currentPos).toBe(500);
});
