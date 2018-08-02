import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import Dispatcher from "./management/Dispatcher";
import DemandConfig from "./DemandConfig";
import { Line } from "./management/Line";
import Map from "./Map";
import IDemand from "./management/IDemand";
import DemandQuarters from "./management/DemandQuarters";
import Station from "./management/Station";
import Time from "./management/Time";
import TimeRange from "./management/TimeRange";
import { Util } from "./Util";
import PolyLine from "./PolyLine";
import Train from "./management/Train";
import LineInfo from "./LineInfo";
import { LineFactory, LineFactoryPhysicalPoint } from "./LineFactory";
import { LineMapDisplay, LineMapDisplayProps } from "./LineMapDisplay";
import Monitor from "./management/Monitor";
import { MonitorComponent, MonitorComponentProps } from "./MonitorComponent";

const demand1:IDemand = new DemandQuarters(require("./sampledata/demand1.json"));

const demand2:IDemand = new DemandQuarters(require("./sampledata/demand2.json"));


const points: LineFactoryPhysicalPoint[] = require("./sampledata/linea1_santiago.json");
points.map(p => { if(p.station) p.demands = [demand1, demand2] });
points.map(p => { if(p.isTerminal) p.timeRange = new TimeRange(new Time(8, 0), new Time(23, 0)) });

const polyLine = new PolyLine(points, "#FF0000");

const lineFactory = new LineFactory();
const lineFromLineClass = lineFactory.fromPhysicalPoints(points);

const stationLocations = [];

points.map(p => { if(p.station) stationLocations.push({ lat: p.lat, lng: p.lng, name: p.station }) });



class App extends React.Component {

  state: any;
  monitor: Monitor;

  constructor(props){
    super(props);
    this.monitor = new Monitor();
    this.state = {
      lines: [
        { name: "Linea 1", color: "#ff0000" },
        { name: "Linea 2", color: "#ff00ff" }
      ],
      trains: [],
      danger: 0
    };

    let d = new Dispatcher(0, lineFromLineClass, [
      new Time(8, 0),
      new Time(12, 0),
      new Time(17, 0),
      new Time(23, 0)
    ]);

    for(let i=0; i<500; i++){
      d.update();
    }

    let interval = setInterval(() => {

      let trains = [];

      let allTrains: Train[] = d.trains;
      let fullLength = lineFromLineClass.fullLength;

      allTrains.map(t => trains.push({
        pos: polyLine.getPointWithinRoute(t.currentPos/fullLength)
      }));


      try {
        d.update();
        this.monitor.trains = d.trains;
        this.setState({
          trains,
          danger: this.monitor.computeDanger()
        });
      } catch(e){
        console.log(e);
        clearInterval(interval);
      }


    }, 1000);

    this.getCoordinates = this.getCoordinates.bind(this);
  }

  getCoordinates(lat, lng){

    console.log(lat, lng)

  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <Map
            trains={this.state.trains}
            isMarkerShown={true}
            defaultClickableIcons={false}
            onGetClickCoordinates={this.getCoordinates}
            defaultCenter={{ lat: -33.4592763, lng: -70.6981906 }}
            defaultZoom={12.22}>

            <LineMapDisplay color="#FF0000" stationLocations={stationLocations} polyLine={polyLine}/>

          </Map>
        </div>

        <DemandConfig/>
        <MonitorComponent danger={this.state.danger}/>

        <div>
          {this.state.lines.map((line, i) => (

            <LineInfo key={i} name={line.name} color={line.color}/>

          ))}
        </div>
      </div>
    );
  }
}

export default App;
