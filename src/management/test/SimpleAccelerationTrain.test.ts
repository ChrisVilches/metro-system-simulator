import { Train } from '../Train';
import { SimpleAccelerationTrain, SimpleAccelerationTrainOptions } from "../SimpleAccelerationTrain";

it('Initial position set correctly', () => {

  let train: Train = new SimpleAccelerationTrain([10, 30, 500], 0);
  expect(train.currentPos).toBe(10);

});



it('It never goes back', () => {

  let train: Train = new SimpleAccelerationTrain([10, 30, 500], 0, { acceleration: 3, maxSpeed: 10, maxWaitTime: 2 });
  expect(train.currentPos).toBe(10);
  train.update();
  expect(train.currentPos).toBe(10);
  train.update();
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

  let train: Train = new SimpleAccelerationTrain([10, 30, 500], 0, { acceleration: 3000000, maxSpeed: 300000, maxWaitTime: 1 });
  expect(train.currentPos).toBe(10);
  train.update();
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

it('Skip first terminal option = false', () => {

  let train: Train = new SimpleAccelerationTrain([10, 30, 500], 0, {
    acceleration: 3000000,
    maxSpeed: 300000,
    maxWaitTime: 10,
    skipFirstTerminal: false
  });
  expect(train.currentPos).toBe(10);
  train.update();
  train.update();
  train.update();
  train.update();
  expect(train.currentPos).toBe(10);

});

it('Skip first terminal option = true', () => {

  let train: Train = new SimpleAccelerationTrain([10, 30, 500], 0, {
    acceleration: 3000000,
    maxSpeed: 300000,
    maxWaitTime: 10,
    skipFirstTerminal: true
  });
  expect(train.currentPos).toBe(10);
  train.update();
  expect(train.currentPos).toBe(30);

});


it('It lowers its speed #1', () => {
  let train: Train = new SimpleAccelerationTrain([0, 100], 0, { acceleration: 1, maxSpeed: 4, maxWaitTime: 3, skipFirstTerminal: false });
  let testFn = pos => {
    expect(train.currentPos).toBe(pos);
    train.signalStop(20);
    train.update();
  };
  [0, 0, 0, 0, 1, 3, 6, 10, 14, 17, 19, 20].map(testFn);
  [22, 25, 29, 33, 37, 41].map(testFn);
});


it('It lowers its speed #2', () => {

  let train: Train = new SimpleAccelerationTrain([0, 100], 0, { acceleration: 1, maxSpeed: 4, skipFirstTerminal: true });

  let testFn = pos => {
    expect(train.currentPos).toBe(pos);
    train.signalStop(20);
    train.update();
  };

  [0, 1, 3, 6, 10, 14, 17, 19, 20].map(testFn);
  [22, 25, 29, 33, 37, 41].map(testFn);
});
