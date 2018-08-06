import * as React from 'react';
import Dispatcher from "./management/Dispatcher";
import { LinePhysical, StationPhysical } from "./LinePhysical";
import { PerformanceCalculator } from "./management/PerformanceCalculator";
import Time from "./management/Time";
import { Line } from "./management/Line";
import { Container, Row, Col, Table } from "reactstrap";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText } from 'reactstrap';
import classnames from 'classnames';
import { Util } from "./Util";
import "./scss/PerformanceMonitorComponent.scss";

export interface PerformanceMonitorComponentProps{
  iteration: number;
  dispatchers: Dispatcher[];
  selectedLine: number;
  linesAllData: LinePhysical[];
}


export class PerformanceMonitorComponent extends React.Component{

  props: PerformanceMonitorComponentProps;
  state: any;
  private linePerformanceCalculators: PerformanceCalculator[];
  private linesAllData: LinePhysical[];

  private trainsEveryMin = [];

  constructor(props: PerformanceMonitorComponentProps){
    super(props);

    this.linePerformanceCalculators = [];
    this.linesAllData = props.linesAllData;

    props.dispatchers.map(d => {
      this.linePerformanceCalculators.push(new PerformanceCalculator(d));
    });

    this.state = {
      iteration: -1,
      activeTab: '1'
    };
  }


  static getDerivedStateFromProps(props, state) {
    if(state.iteration === props.iteration) return {};
    //console.log("Updated");
    return {
      iteration: props.iteration,
      selectedLine: props.selectedLine
    };
  }

  DELETEME_supplyByStationName(str: string):number{

    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }

    hash = Math.abs(hash) % 40;

    let random = 90 + hash;
    return Util.truncate(random/60, 2);
  }

  render(){

    let dispatcher: Dispatcher = this.linePerformanceCalculators[this.state.selectedLine].dispatcher;
    let currentTime: Date = dispatcher.currentTime;
    let currentTimeHr = currentTime.getHours();
    let currentTimeMin = currentTime.getMinutes();
    let currentLine = this.linesAllData[this.state.selectedLine];


    return (
      <div>

        <Nav tabs={true} className="mb-2">
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '1' })}>
              Line
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '2' })}>
              General
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '3' })}>
              Settings
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">

                <p><small>Current line is <b>{this.linesAllData[this.state.selectedLine].name}</b></small></p>

                <Table>
                  <thead>
                    <tr>
                      <th>Station</th>
                      <th>Estimated demand</th>
                      <th>Trains every</th>
                      <th>Supply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLine.stationLocations.map((_, i: number) => (
                      <tr key={i}>
                        <td>{currentLine.stationLocations[i].name}</td>
                        <td>{currentLine.line.stations[i].demand[0].getDemand(new Time(currentTimeHr, currentTimeMin))}%</td>
                        <td>~{this.DELETEME_supplyByStationName(currentLine.stationLocations[i].name)} min</td>
                        <td>
                          {Util.truncate(PerformanceCalculator.demandSatisfied(this.DELETEME_supplyByStationName(currentLine.stationLocations[i].name), currentLine.line.stations[i].demand[0].getDemand(new Time(currentTimeHr, currentTimeMin))), 3)}
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </Table>


              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="6">
                <Card body={true}>
                  <CardTitle>Special Title Treatment</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  <Button>Go somewhere</Button>
                </Card>
              </Col>
              <Col sm="6">
                <Card body={true}>
                  <CardTitle>Special Title Treatment</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  <Button>Go somewhere</Button>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>




      </div>
    );
  }


}
