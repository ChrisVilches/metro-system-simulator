import * as React from 'react';
import { Line } from "react-chartjs";
import "./MonitorComponent.css";

export interface MonitorComponentProps{
  danger: number;
  iteration: number;
}

const dangerChartOptions = {
  pointDotRadius: 0,
  scaleOverride: true,
  scaleSteps: 1,
  scaleStepWidth: 100,
  scaleStartValue: 0,
  animation: false,
  scaleShowLabels: false,
  tooltips: {
    enabled: false
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
      iteration: 0,
      chartData: null,
      dangerValues: dangerValues
    };
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

    let chartData = {
      labels: labels,
      datasets: [
        {
          fillColor: `rgba(180,180,180,0.2)`,
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: newArray
        }
      ]
    };

    return {
      iteration: nextProps.iteration,
      dangerValues: newArray,
      chartData
    };
  }


  render(){

    return (
      <div>

        <div className="margin-bottom">Iteration: {this.state.iteration}</div>

        <hr/>

        <div className="info-box">
          This is a danger detector. When two trains are too close to each other,
          the peak will be high. When all trains are separate from each other, it'll be considered
          as non-dangerous.
        </div>

        {this.state.chartData !== null? (
          <Line data={this.state.chartData} options={dangerChartOptions} width="180" height="90" className="monitor-chart"/>
        ) : ""}
      </div>
    );
  }


}
