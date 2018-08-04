import * as React from 'react';
import { Container, Row, Col } from "reactstrap";
import "./scss/MonitorComponent.scss";
import { Line, ChartComponentProps, LinearComponentProps } from 'react-chartjs-2';

export interface MonitorComponentProps{
  danger: number;
  iteration: number;
  totalTrains: number;
}


const dangerChartOptions = {
  legend: {
    display: false
  },
  pointDotRadius: 0,
  scaleOverride: true,
  scaleSteps: 1,
  scaleStepWidth: 100,
  scaleStartValue: 0,
  animation: false,
  scaleShowLabels: false,
  responsive: true,
  tooltips: {
    enabled: false
  },
  scales: {
    yAxes: [{
      display: false,
      ticks: {
        beginAtZero:true,
        steps: 10,
        max: 100
      }
    }]
  }
};

const maxItems = 10;

export class MonitorComponent extends React.Component{

  props: MonitorComponentProps;
  state: any;

  constructor(props: MonitorComponentProps){
    super(props);

    let dangerValues = [];
    for(let i=0; i<maxItems; i++) dangerValues.push(0);

    this.state = {
      chartData: null,
      dangerValues: dangerValues
    };
  }


  static getColor(danger: number){
    let red = [232, 44, 44];
    let orange = [246, 193, 79];
    let green = [101, 214, 122];
    let blue = [141, 192, 234];

    let between = (x, y) => x <= danger && danger <= y;

    let c1, c2, p;

    if(between(0, 33)){
      c1 = blue;
      c2 = green;
      p = danger;
    }
    else if(between(33, 66)){
      c1 = green;
      c2 = orange;
      p = danger - 33;
    }
    else{
      c1 = orange;
      c2 = red;
      p = danger - 66;
    }

    let dy = [c2[0]-c1[0], c2[1]-c1[1], c2[2]-c1[2]];
    let dx = 33;
    let slope = [dy[0]/dx, dy[1]/dx, dy[2]/dx];

    let r = c1[0] + (slope[0] * p);
    let g = c1[1] + (slope[1] * p);
    let b = c1[2] + (slope[2] * p);

    return { r, g, b};

  }


  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.iteration === prevState.iteration){
      return {};
    }

    let newArray = prevState.dangerValues.concat(nextProps.danger * 100);

    if(newArray.length > maxItems){
      newArray = newArray.splice(-maxItems);
    }

    let labels = [];

    for(let i=0; i<maxItems; i++){
      labels.push(" ");
    }

    let color = MonitorComponent.getColor(nextProps.danger * 100);

    let chartData = {
      labels: labels,
      datasets: [
        {
          pointRadius: 0,
          backgroundColor: `rgba(${color.r},${color.g},${color.b},0.3)`,
          borderColor: `rgba(${color.r},${color.g},${color.b},0.3)`,
          data: newArray
        }
      ]
    };

    return {
      iteration: nextProps.iteration,
      totalTrains: nextProps.totalTrains,
      dangerValues: newArray,
      chartData
    };
  }


  render(){

    return (
      <div>

        <Container>
          <Row>
            <Col xs={8}>Iterations</Col>
            <Col xs={4}>{this.state.iteration}</Col>
          </Row>
          <Row>
            <Col xs={8}>Trains</Col>
            <Col xs={4}>{this.state.totalTrains}</Col>
          </Row>
        </Container>

        <hr/>

        <div className="info-box">
          This is a danger detector. When two trains are too close to each other,
          the peak will be high. When all trains are separate from each other, it'll be considered
          as non-dangerous.
        </div>

        {this.state.chartData !== null? (
          <Line data={this.state.chartData} options={dangerChartOptions}/>
        ) : ""}
      </div>
    );
  }


}
