import * as React from 'react';
import './scss/App.scss';
import Dispatcher from "./management/Dispatcher";
import Map from "./Map";
import Time from "./management/Time";
import TimeRange from "./management/TimeRange";
import { Train } from "./management/Train";
import { LineFactoryPhysicalPoint, LinePhysical } from "./LinePhysical";
import { LineMapDisplay } from "./LineMapDisplay";
import { PerformanceCalculator } from "./management/PerformanceCalculator";
import { MonitorComponent } from "./MonitorComponent";
import { TimeLine, TimeLineProps } from "./TimeLine";
import { SectionComponent } from "./SectionComponent";
import { Row, Col, Container, Button, Navbar, NavbarBrand, NavItem, Input } from "reactstrap";
import { SelectMobilePC, SelectMobilePCProps } from "./SelectMobilePC";
import { NavComponent, FooterComponent } from "./HeaderFooter";
import AboutCarousel from "./AboutCarousel";
import { PerformanceMonitorComponent } from "./PerformanceMonitorComponent";



class App extends React.Component {

  public state: any;
  private dispatchers: Dispatcher[] = [];
  private interval: NodeJS.Timer;
  private monitors: PerformanceCalculator[] = [];


  private linesData: LinePhysical[] = [
    new LinePhysical(require("./sampledata/tokyo/ginza.json"), "銀座線", "#FFA447"),
    new LinePhysical(require("./sampledata/tokyo/nanboku.json"), "南北線", "#00AE9C"),
    new LinePhysical(require("./sampledata/tokyo/marunouchi.json"), "丸ノ内線", "#dd5858"),
    new LinePhysical(require("./sampledata/tokyo/chiyoda.json"), "千代田線", "#00BC86"),
    new LinePhysical(require("./sampledata/tokyo/shinjuku.json"), "新宿線", "#8BC05D"),
    new LinePhysical(require("./sampledata/tokyo/hibiya.json"), "日比谷線", "#AAA"),
    new LinePhysical(require("./sampledata/tokyo/touzai.json"), "東西線", "#009BBF"),
    new LinePhysical(require("./sampledata/tokyo/hanzoumon.json"), "半蔵門線", "#8F76D6"),
    new LinePhysical(require("./sampledata/tokyo/yamanote.json"), "山手線", "#90E088"),
    new LinePhysical(require("./sampledata/tokyo/yurakucho.json"), "有楽町線", "#C2A46F")
  ];



  constructor(props){
    super(props);

    let now: Date = new Date();


    for(let i in this.linesData){
      this.dispatchers.push(
        new Dispatcher(now, 0, this.linesData[i].line, [
          new Time(8, 0),
          new Time(12, 0),
          new Time(17, 0),
          new Time(23, 0)
        ])
      );
    }

    this.dispatchers.map(d => {
      this.monitors.push(new PerformanceCalculator(d));
    });

    this.state = {
      iteration: 0,
      trains: [],
      danger: 0,
      selectedLine: 2,
      estimates: [],
      totalTrains: 0,
      debugPoints: []
    };


    for(let i=0; i<100; i++){
      for(let j=0; j<this.dispatchers.length; j++){
        this.dispatchers[j].update();
      }
    }


  }

  componentDidMount(){
    //this.interval = setInterval(this.updateState, 1000);


    let pts = this.pointsAccum;



     document.addEventListener("keypress", function(e){
       if (e.code === "KeyQ"){
         let stationName = prompt();
         if(stationName !== null && stationName.trim().length !== 0){
           pts[pts.length-1].station = stationName;
           console.log(JSON.stringify(pts))
         }
       }
     })

  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }


  updateState = () => {

    let trainsPhysical = [];
    let danger: number = 0;
    let totalTrains: number = 0;
    let dispatchers = this.dispatchers;

    for(let i=0; i<dispatchers.length; i++){

      let d: Dispatcher = dispatchers[i];
      let trains: Train[] = d.trains;
      totalTrains += trains.length;
      let fullLength: number = this.linesData[i].line.fullLength;

      danger = Math.max(danger, this.monitors[i].computeDanger());

      trains.map(t => trainsPhysical.push({
        pos: this.linesData[i].polyLine.getPointWithinRoute(t.currentPos/fullLength)
      }));
      d.update();
    }


    this.setState(function(state:any, props){

      let newState = {
        trains: trainsPhysical,
        iteration: state.iteration+1,
        danger,
        totalTrains,
        estimates: dispatchers[state.selectedLine].getEstimatedTimes()
      };

      return newState;
    });

  }



  private pointsAccum: any = [];

  getCoordinates = (lat, lng) => {

    // Listen to keyboard.

    console.log(lat, lng)
    this.pointsAccum.push({
      lat, lng
    });

    this.setState({
      debugPoints: this.pointsAccum
    });


    console.log(JSON.stringify(this.pointsAccum));
  }


  onChangeSelectedLine = (result) => {
    console.log(result)
    this.setState({
      selectedLine: result.index
    });
  }



  public render() {

    let lineOptions = [];
    this.linesData.map(l => lineOptions.push({
      label: l.name,
      color: l.color
    }));


    return (
      <div className="d-flex flex-column wrapper">

        <NavComponent/>


        <Container className="flex-fill mb-4">
          <Row>
            <Col md={3}>

              <div className="mb-2">
                <AboutCarousel/>
              </div>

              <SectionComponent faIcon="area-chart" title="Monitor">
                <MonitorComponent danger={this.state.danger} iteration={this.state.iteration} totalTrains={this.state.totalTrains}/>
              </SectionComponent>

            </Col>

            <Col md={6}>

              <div className="mb-2">
                <Map
                  trains={this.state.trains}
                  isMarkerShown={true}
                  defaultClickableIcons={false}
                  debugPoints={this.state.debugPoints}
                  onGetClickCoordinates={this.getCoordinates}
                  defaultCenter={{ lat: 35.68167447027946, lng: 139.72971705972697 }}
                  defaultZoom={12.22}>

                  {this.linesData.map((l, i) => (
                    <LineMapDisplay
                      key={i}
                      color={l.color}
                      showStationMarkers={this.state.selectedLine === i}
                      stationLocations={l.stationLocations}
                      polyLine={l.polyLine}/>
                  ))}
                </Map>
              </div>

              <SectionComponent faIcon="bar-chart" title={`Performance`}>
                <PerformanceMonitorComponent
                  iteration={this.state.iteration}
                  linesAllData={this.linesData}
                  selectedLine={this.state.selectedLine}
                  dispatchers={this.dispatchers}/>
              </SectionComponent>

            </Col>
            <Col md={3}>
              <SectionComponent faIcon="train" title="Select line">
                <SelectMobilePC onResult={this.onChangeSelectedLine} options={lineOptions} defaultSelectedIndex={this.state.selectedLine}/>
              </SectionComponent>


              <SectionComponent faIcon="map" title="Stations">
                <div className="timeline-section">
                  <TimeLine
                    stationsPhysical={this.linesData[this.state.selectedLine].stationLocations}
                    color={this.linesData[this.state.selectedLine].color}
                    estimates={this.state.estimates}
                    stations={this.linesData[this.state.selectedLine].line.stations}/>
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
