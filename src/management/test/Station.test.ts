import Station from '../Station';
import DemandQuarters from '../DemandQuarters';
import TimeRange from '../TimeRange';
import Time from '../Time';

const demand1 = new DemandQuarters([
  { hr: 8, quarters: [10, 40, 70, 80]  },
  { hr: 9, quarters: [80, 85, 79, 80]  }
]);


it('Station without times is not a terminal', () => {
  let station: Station = new Station([demand1, demand1]);
  expect(station.isTerminal).toBe(false);
});


it('Station with times is a terminal', () => {
  let station: Station = new Station([demand1, demand1], new TimeRange(new Time(9, 12), new Time(19, 5)));
  expect(station.isTerminal).toBe(true);
});
