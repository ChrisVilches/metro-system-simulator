import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import Dispatcher from "./management/Dispatcher";
import DemandConfig from "./DemandConfig";
import Line from "./management/Line";
import Map from "./Map";

const points = [
  { lat: -33.48206978364929, lng: -70.74526692115529, station: "Monte Tabor" },
  { lat: -33.47541186094913, lng: -70.73960209571584, station: "Las Parcelas" },
  { lat: -33.47133094575308, lng: -70.73702717506154 },
  { lat: -33.46259570946101, lng: -70.73822880470021, station: "Laguna Sur" },
  { lat: -33.452713807355344, lng: -70.73934460365041, station: "Barrancas" },
  { lat: -33.44490774078097, lng: -70.74106121741994, station: "Pudahuel" },
  { lat: -33.44407722048203, lng: -70.72346388600789, station: "San Pablo" },
  { lat: -33.45142478057161, lng: -70.72260761939748, station: "Neptuno" },
  { lat: -33.45607950918132, lng: -70.72080517493947 },
  { lat: -33.4577981150467, lng: -70.71591282569631, station: "Pajaritos"},
  { lat: -33.457368466773914, lng: -70.7060422965215, station: "Las Rejas" },
  { lat: -33.456222727637844, lng: -70.70037747108205, station: "Ecuador" },
  { lat: -33.45421764772004, lng: -70.6924810477422, station: "San Alberto Hurtado" },
  { lat: -33.45306112507489, lng: -70.68600083076223, station: "Universidad de Santiago" },
  { lat: -33.451593071157646, lng: -70.67866230689748, station: "Estacion Central" },
  { lat: -33.44948046215244, lng: -70.67316914283498, station: "Union latinoamericana" },
  { lat: -33.448012347622516, lng: -70.66754723273976, station: "Republica" },
  { lat: -33.44700971854116, lng: -70.66123867713674, station: "Los Heroes" },
  { lat: -33.44480747469646, lng: -70.65348172866567, station: "Moneda" },
  { lat: -33.44398385694255, lng: -70.65025234901174, station: "Universidad de Chile" },
  { lat: -33.44277527325621, lng: -70.6457247801946, station: "Santa Lucia" },
  { lat: -33.44050129978997, lng: -70.64065004073842, station: "Universidad Catolica" },
  { lat: -33.43700964971305, lng: -70.63335443221791, station: "Baquedano" }
]


const line = {
  path: points,
  color: "#ff0000"
};

let fullDistance = 0;

function getDistance(a, b){
  let n = (a.latitude - b.latitude);
  let m = (a.longitude - b.longitude);
  n *= n;
  m *= m;
  let sqrt = Math.sqrt(n + m);
  return sqrt;
}

for(let i=0; i<points.length-1; i++){
  let a = points[i];
  let b = points[i+1];
  fullDistance += getDistance(
    {latitude: a.lat, longitude: a.lng},
    {latitude: b.lat, longitude: b.lng}
  );
}

const segments = [];


for(let i=0; i<points.length-1; i++){
  let a = points[i];
  let b = points[i+1];
  let distance = getDistance(
    {latitude: a.lat, longitude: a.lng},
    {latitude: b.lat, longitude: b.lng}
  );
  segments.push({
    a, b, distance, percent: distance/fullDistance
  });
}



function getPointWithinRoute(segments: any[], percent: number){
  if(percent > 1) percent = 1;
  if(percent < 0) percent = 0;

  let percentDifference = percent;

  for(let i=0; i<segments.length; i++){

    let seg = segments[i];
    if(percentDifference <= seg.percent){

      let segmentPercent = percentDifference/seg.percent;

      let unitaryLat = seg.b.lat - seg.a.lat;
      let unitaryLng = seg.b.lng - seg.a.lng;
      unitaryLat /= seg.distance;
      unitaryLng /= seg.distance;

      return {
        lat: seg.a.lat + (unitaryLat * (seg.distance * segmentPercent)),
        lng: seg.a.lng + (unitaryLng * (seg.distance * segmentPercent))
      };
    }

    percentDifference -= seg.percent;
  }

  throw Error("Not found within route");
}

//console.log(getPointWithinRoute(segments, 1))
const trains = [
  { pos: getPointWithinRoute(segments, 1) }
];



class LineMap extends React.Component {

  props: any;

  constructor(props){
    super(props);
    this.state = {
    };
  }

  public render(){
    return <p>{this.props.name} color = {this.props.color}</p>
  }
}

class App extends React.Component {

  state: any;

  constructor(props){
    super(props);
    this.state = {
      lines: [
        { name: "Linea 1", color: "#ff0000" },
        { name: "Linea 2", color: "#ff00ff" }
      ],
      pos: 0,
      trains: [
        { pos: getPointWithinRoute(segments, 0) }
      ]
    };

    setInterval(() => {
      let trains = this.state.trains;
      trains[0].pos = getPointWithinRoute(segments, this.state.pos);
      this.setState({
        pos: this.state.pos += 0.01,
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
            lines={[line]}
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

            <LineMap key={i} name={line.name} color={line.color}/>

          ))}
        </div>
      </div>
    );
  }
}

export default App;
