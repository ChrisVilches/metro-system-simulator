import * as React from 'react';
import './scss/App.scss';
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
import { Row, Col, Container, Button, Navbar, NavbarBrand, NavItem, Input } from "reactstrap";
import { SelectMobilePC, SelectMobilePCProps } from "./SelectMobilePC";
import { NavComponent, FooterComponent } from "./HeaderFooter";

const demand1:IDemand = new DemandQuarters(require("./sampledata/demand1.json"));

const demand2:IDemand = new DemandQuarters(require("./sampledata/demand2.json"));

class LineAllData {

  private _points: LineFactoryPhysicalPoint[];
  private _polyLine: PolyLine;
  private _stationLocations: any[];
  private _color: string;
  private _line: Line;
  private _name: string;

  constructor(phyiscalPoints: LineFactoryPhysicalPoint[], name: string, color: string){

    this._color = color;
    this._name = name;

    this._points = phyiscalPoints;
    this._points.map(p => { if(p.station) p.demands = [demand1, demand2] });
    this._points.map(p => { if(p.isTerminal) p.timeRange = new TimeRange(new Time(8, 0), new Time(23, 0)) });

    let lineFactory: LineFactory = new LineFactory();
    this._line = lineFactory.fromPhysicalPoints(this._points);
    this._polyLine = new PolyLine(this._points);

    this._stationLocations = [];
    this._points.map(p => { if(p.station) this._stationLocations.push({ lat: p.lat, lng: p.lng, name: p.station }) });

  }

  public get name(){
    return this._name;
  }

  public get polyLine(){
    return this._polyLine;
  }

  public get color(){
    return this._color;
  }

  public get stationLocations(){
    return this._stationLocations;
  }

  public get line(){
    return this._line;
  }
}



const linesData: LineAllData[] = [
  new LineAllData(require("./sampledata/linea1_santiago.json"), "Linea 1", "#BF0000"),
  new LineAllData(require("./sampledata/linea2_santiago.json"), "Linea 2", "#FFA447"),
  new LineAllData(require("./sampledata/linea4_santiago.json"), "Linea 4", "#1C1CFF"),
  new LineAllData(require("./sampledata/linea5_santiago.json"), "Linea 5", "#7ED071"),
  new LineAllData(require("./sampledata/linea6_santiago.json"), "Linea 6", "#BC60E1")
];


class App extends React.Component {

  state: any;
  monitor: Monitor;

  constructor(props){
    super(props);
    this.monitor = new Monitor();

    let dispatchers: Dispatcher[] = [];

    for(let i in linesData){
      dispatchers.push(
        new Dispatcher(0, linesData[i].line, [
          new Time(8, 0),
          new Time(12, 0),
          new Time(17, 0),
          new Time(23, 0)
        ])
      );
    }

    this.state = {
      iteration: 0,
      trains: [],
      danger: 0,
      selectedLine: 2,
      estimates: [],
      totalTrains: 0
    };


    for(let i=0; i<100; i++){
      for(let j=0; j<dispatchers.length; j++){
        dispatchers[j].update();
      }
    }

    let interval = setInterval(() => {

      try {

        let trainsPhysical = [];
        let danger: number = 0;
        let totalTrains: number = 0;

        for(let i=0; i<dispatchers.length; i++){

          let d: Dispatcher = dispatchers[i];
          let trains: Train[] = d.trains;
          totalTrains += trains.length;
          let fullLength: number = linesData[i].line.fullLength;

          danger = Math.max(danger, this.monitor.computeDanger(d.trains));

          trains.map(t => trainsPhysical.push({
            pos: linesData[i].polyLine.getPointWithinRoute(t.currentPos/fullLength)
          }));
          d.update();
        }

        this.setState({
          trains: trainsPhysical,
          iteration: this.state.iteration+1,
          danger,
          totalTrains,
          estimates: dispatchers[this.state.selectedLine].getEstimatedTimes()
        });

      } catch(e){
        console.log(e);
        clearInterval(interval);
      }

    }, 1000);


  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  getCoordinates = (lat, lng) => {

    console.log(lat, lng)

  }


  onChangeSelectedLine = (result) => {
    console.log(result)
    this.setState({
      selectedLine: result.index
    });
  }


  public render() {

    let lineOptions = [];
    linesData.map(l => lineOptions.push({
      label: l.name,
      color: l.color
    }));


    return (
      <div className="d-flex flex-column wrapper">

        <NavComponent/>


        <Container className="flex-fill">
          <Row>
            <Col md={3}>
              <SectionComponent faIcon="area-chart" title="Monitor">
                <MonitorComponent danger={this.state.danger} iteration={this.state.iteration} totalTrains={this.state.totalTrains}/>
              </SectionComponent>

              <SectionComponent faIcon="info" title="About">
                <p>
                  This is a train system simulator. It was created
                  mainly with the purpose of developing and testing different AI and scheduling algorithms.
                </p>
              </SectionComponent>
            </Col>
            <Col md={6} className="mb-2">
              <Map
                trains={this.state.trains}
                isMarkerShown={true}
                defaultClickableIcons={false}
                onGetClickCoordinates={this.getCoordinates}
                defaultCenter={{ lat: -33.4592763, lng: -70.6981906 }}
                defaultZoom={12.22}>

                {linesData.map((l, i) => (
                  <LineMapDisplay
                    key={i}
                    color={l.color}
                    showStationMarkers={this.state.selectedLine === i}
                    stationLocations={l.stationLocations}
                    polyLine={l.polyLine}/>
                ))}



              </Map>
            </Col>
            <Col md={3}>
              <SectionComponent faIcon="train" title="Select line">
                <SelectMobilePC onResult={this.onChangeSelectedLine} options={lineOptions} defaultSelectedIndex={this.state.selectedLine}/>
              </SectionComponent>


              <SectionComponent faIcon="map" title="Stations">
                <div className="timeline-section">
                  <TimeLine
                    stationsPhysical={linesData[this.state.selectedLine].stationLocations}
                    color={linesData[this.state.selectedLine].color}
                    estimates={this.state.estimates}
                    stations={linesData[this.state.selectedLine].line.stations}/>
                </div>
              </SectionComponent>

            </Col>
          </Row>
        </Container>


        <FooterComponent/>

      </div>
    );
  }
}

export default App;
