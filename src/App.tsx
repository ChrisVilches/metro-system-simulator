import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import Dispatcher from "./management/Dispatcher";
import DemandConfig from "./DemandConfig";
import Line from "./management/Line";
import Map from "./Map";
import IDemand from "./management/IDemand";
import DemandQuarters from "./management/DemandQuarters";
import Station from "./management/Station";
import Time from "./management/Time";
import TimeRange from "./management/TimeRange";
import { Util } from "./Util";
import PolyLine from "./PolyLine";
import LineInfo from "./LineInfo";
import LineFactory from "./LineFactory";

const demand1:IDemand = new DemandQuarters(require("./sampledata/demand1.json"));

const demand2:IDemand = new DemandQuarters(require("./sampledata/demand2.json"));


const points = require("./sampledata/linea1_santiago.json");
points.map(p => { if(p.station) p.demands = [demand1, demand2] });
points.map(p => { if(p.isTerminal) p.timeRange = new TimeRange(new Time(8, 0), new Time(23, 0)) });

const polyLine = new PolyLine(points, "#FF0000");

const lineFactory = new LineFactory();
const lineFromLineClass = lineFactory.fromPhysicalPoints(points);


class App extends React.Component {

  state: any;

  constructor(props){
    super(props);
    this.state = {
      lines: [
        { name: "Linea 1", color: "#ff0000" },
        { name: "Linea 2", color: "#ff00ff" }
      ],
      trains: []
    };

    let d = new Dispatcher(0, lineFromLineClass, [
      new Time(8, 0),
      new Time(12, 0),
      new Time(17, 0),
      new Time(23, 0)
    ]);

    setInterval(() => {

      let trains = [];

      let allTrains = d.trains;
      let fullLength = lineFromLineClass.fullLength;

      allTrains.map(t => trains.push({
        pos: polyLine.getPointWithinRoute(t.currentPos/fullLength)
      }));


      let minLat = Infinity;
      let maxLat = -Infinity;
      let minLng = Infinity;
      let maxLng = -Infinity;

      for(let i=0; i<polyLine.points.length; i++){
        let a1 = polyLine.points[i].lat;
        let b1 = polyLine.points[i].lng;
        if(a1 < minLat) minLat = a1;
        if(a1 > maxLat) maxLat = a1;
        if(b1 < minLng) minLng = b1;
        if(b1 > maxLng) maxLng = b1;
      }
      //console.log(minLat, maxLat, minLng, maxLng)

      var c:any=document.getElementById("canvas");
      var ctx=c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.beginPath();
      ctx.strokeStyle="#000000";
      let f = 3800;
      let x = 3800;
      let xOffset = minLat;
      let yOffset = minLng;
      for(let i=0; i<polyLine.points.length; i++){

        let a1 = polyLine.points[i].lat;
        let b1 = polyLine.points[i].lng;
        a1 = Math.abs(a1);
        b1 = Math.abs(b1);

        a1 = (a1 + xOffset)*f;
        b1 = (b1 + yOffset)*x;
        a1 = Math.abs(a1);
        b1 = Math.abs(b1);

        ctx.beginPath();
        ctx.arc(a1, b1,2,0,2*Math.PI);
        ctx.stroke();

        if(i === 0) ctx.moveTo(a1, b1);
        else
        ctx.lineTo(a1, b1);

      }
      ctx.stroke();


      ctx.strokeStyle="#FF0000";
      for(let i=0; i<trains.length; i++){

        let a1 = trains[i].pos.lat;
        let b1 = trains[i].pos.lng;
        a1 = Math.abs(a1);
        b1 = Math.abs(b1);
        a1 = (a1 + xOffset)*f;
        b1 = (b1 + yOffset)*x;
        a1 = Math.abs(a1);
        b1 = Math.abs(b1);

        ctx.beginPath();
        ctx.arc(a1, b1,2,0,2*Math.PI);
        ctx.stroke();

        if(i === 0) ctx.moveTo(a1, b1);
        else
        ctx.lineTo(a1, b1);

      }


      d.update();
      this.setState({
        trains
      });

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
            lines={[polyLine]}
            trains={this.state.trains}
            isMarkerShown={true}
            defaultClickableIcons={false}
            onGetClickCoordinates={this.getCoordinates}
            defaultCenter={{ lat: -33.4592763, lng: -70.6981906 }}
            defaultZoom={12.22}/>
        </div>

        <DemandConfig/>

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
