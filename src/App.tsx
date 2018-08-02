import * as React from 'react';
import './App.scss';
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
import { Train } from "./management/Train";
import { LineFactory, LineFactoryPhysicalPoint } from "./LineFactory";
import { LineMapDisplay } from "./LineMapDisplay";
import { Monitor } from "./management/Monitor";
import { MonitorComponent } from "./MonitorComponent";
import { TimeLine, TimeLineProps } from "./TimeLine";
import { SectionComponent } from "./SectionComponent";


const demand1:IDemand = new DemandQuarters(require("./sampledata/demand1.json"));

const demand2:IDemand = new DemandQuarters(require("./sampledata/demand2.json"));


const points: LineFactoryPhysicalPoint[] = require("./sampledata/linea1_santiago.json");
points.map(p => { if(p.station) p.demands = [demand1, demand2] });
points.map(p => { if(p.isTerminal) p.timeRange = new TimeRange(new Time(8, 0), new Time(23, 0)) });

const polyLine = new PolyLine(points);

const lineFactory = new LineFactory();
const lineFromLineClass = lineFactory.fromPhysicalPoints(points);

const stationLocations = [];

points.map(p => { if(p.station) stationLocations.push({ lat: p.lat, lng: p.lng, name: p.station }) });

const color = "#bf0000";



class App extends React.Component {

  state: any;
  monitor: Monitor;

  constructor(props){
    super(props);
    this.monitor = new Monitor();

    let d = new Dispatcher(0, lineFromLineClass, [
      new Time(8, 0),
      new Time(12, 0),
      new Time(17, 0),
      new Time(23, 0)
    ]);


    this.state = {
      lines: [
        { name: "Linea 1", color: color },
        { name: "Linea 2", color: "#7f30ca" }
      ],
      iteration: 0,
      trains: [],
      danger: 0,
      estimates: d.getEstimatedTimes()
    };


    for(let i=0; i<300; i++){
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
          iteration: this.state.iteration+1,
          danger: this.monitor.computeDanger(),
          estimates: d.getEstimatedTimes()
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
      <div>

        <header className="App-header">
          <h1 className="App-title">Metro System Simulator</h1>
        </header>

        <div className="container">



          <div className="row">

            <div className="three columns">
              <SectionComponent title={<span><i className="fa fa-sm fa-area-chart icon-section"/>Monitor</span>}>
                <MonitorComponent danger={this.state.danger} iteration={this.state.iteration}/>
              </SectionComponent>

              <SectionComponent title={<span><i className="fa fa-sm fa-info icon-section"/>About</span>}>
                <p>
                  This is a train system simulator. It was created
                  mainly with the purpose of developing and testing different AI and scheduling algorithms.
                </p>
              </SectionComponent>

            </div>

            <div className="six columns">

              <Map
                trains={this.state.trains}
                isMarkerShown={true}
                defaultClickableIcons={false}
                onGetClickCoordinates={this.getCoordinates}
                defaultCenter={{ lat: -33.4592763, lng: -70.6981906 }}
                defaultZoom={12.22}>

                <LineMapDisplay color={color} stationLocations={stationLocations} polyLine={polyLine}/>

              </Map>

            </div>


            <div className="three columns">

              <SectionComponent title={<span><i className="fa fa-sm fa-train icon-section"/>Select line</span>}>
                <select>
                  <option value="a">a</option>
                  <option value="b">b</option>
                  <option value="c">c</option>
                </select>
              </SectionComponent>

              <TimeLine stationsPhysical={stationLocations} color={color} estimates={this.state.estimates} stations={lineFromLineClass.stations}/>

            </div>

          </div>

        </div>


        <div className="footer">

          <hr/>
          <div className="footer-content">
            <p>By Felo Vilches, 2018</p>
            <p>
              <a className="stylish-link" href="https://github.com/FeloVilches/i-like-trains" target="_blank">
                <i className="fa fa-github"/>
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
