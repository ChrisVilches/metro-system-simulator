import Line from "./Line";
import DemandQuarters from "./DemandQuarters";
import IDemand from "./IDemand";
import Station from "./Station";
import Dispatcher from "./Dispatcher";

let demand1:IDemand = new DemandQuarters([
  { hr: 8, quarters: [100, 40, 100, 80]  },
  { hr: 9, quarters: [80, 100, 79, 80]  },
  { hr: 10, quarters: [80, 99, 60, 50]  },
  { hr: 11, quarters: [80, 95, 90, 32]  },
  { hr: 12, quarters: [30, 80, 32, 34]  },
  { hr: 13, quarters: [30, 45, 35, 34]  },
  { hr: 14, quarters: [30, 35, 33, 34]  },
  { hr: 15, quarters: [30, 35, 32, 34]  },
  { hr: 16, quarters: [30, 35, 32, 34]  },
  { hr: 17, quarters: [30, 35, 32, 34]  },
  { hr: 18, quarters: [80, 85, 79, 80]  },
  { hr: 19, quarters: [82, 87, 79, 72]  },
  { hr: 20, quarters: [80, 85, 79, 80]  },
  { hr: 21, quarters: [10, 40, 70, 80]  },
  { hr: 22, quarters: [10, 5, 8, 13]  }
]);

let demand2:IDemand = new DemandQuarters([
  { hr: 8, quarters: [90, 40, 60, 90]  },
  { hr: 9, quarters: [80, 90, 35, 38]  },
  { hr: 10, quarters: [100, 60, 40, 100]  },
  { hr: 11, quarters: [40, 30, 80, 80]  },
  { hr: 12, quarters: [95, 90, 42, 34]  },
  { hr: 13, quarters: [30, 45, 65, 34]  },
  { hr: 14, quarters: [32, 35, 53, 34]  },
  { hr: 15, quarters: [10, 65, 32, 34]  },
  { hr: 16, quarters: [20, 35, 62, 34]  },
  { hr: 17, quarters: [10, 35, 32, 34]  },
  { hr: 18, quarters: [80, 85, 79, 80]  },
  { hr: 19, quarters: [82, 87, 79, 72]  },
  { hr: 20, quarters: [80, 85, 79, 80]  },
  { hr: 21, quarters: [10, 40, 70, 80]  },
  { hr: 22, quarters: [10, 5, 8, 13]  }
]);

let st1 = new Station({ demand: [demand2, demand2], firstTrainTime: { hr: 6, min: 0 }, lastTrainTime: { hr: 11, min: 30 }});
let st2 = new Station({ demand: [demand2, demand1] });
let st3 = new Station({ demand: [demand1, demand2], firstTrainTime: { hr: 7, min: 0 }, lastTrainTime: { hr: 0, min: 30 }});
let st4 = new Station({ demand: [demand2, demand1] });
let st5 = new Station({ demand: [demand1, demand2] });
let st6 = new Station({ demand: [demand2, demand1] });
let st7 = new Station({ demand: [demand2, demand1], firstTrainTime: { hr: 6, min: 30 }, lastTrainTime: { hr: 1, min: 30 }});


let stations = [
  { station: st1, distanceFromPrev: null },
  { station: st2, distanceFromPrev: 1000 },
  { station: st3, distanceFromPrev: 1500 },
  { station: st4, distanceFromPrev: 1320 },
  { station: st5, distanceFromPrev: 1100 },
  { station: st6, distanceFromPrev: 900 },
  { station: st7, distanceFromPrev: 1600 }
];

let line = new Line(stations);

let d = new Dispatcher(0, { hr: 8, min: 5 }, line, [
  { hr: 8, min: 0 },
  { hr: 12, min: 0 },
  { hr: 17, min: 0 },
  { hr: 23, min: 0 }
]);

let interval = setInterval(() => d.update(), 1000);
