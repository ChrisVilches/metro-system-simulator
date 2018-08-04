import * as React from 'react';
import "./scss/TimeLine.scss";
import { Line } from "react-chartjs-2";
import Station from "./management/Station";
import IDemand from "./management/IDemand";
import Time from "./management/Time";
import * as _ from "lodash";

export interface TimeLineProps{
  stations: Station[];
  stationsPhysical: any[];
  estimates: number[][];
  color: string;
}

interface StationInfoComponentProps{
  name: string;
  estimate: number;
  demands: IDemand[];
  color: string;
  isLast: boolean;
}

const lineChartOptions = {
  pointDotRadius: 0,
  scaleOverride: true,
  scaleSteps: 4,
  scaleStepWidth: 25,
  scaleStartValue: 0,
  scaleShowLabels: false,
  responsive: true,
  legend: {
    display: false
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

class StationInfoComponent extends React.Component{

  props: StationInfoComponentProps;
  state: any;

  constructor(props: StationInfoComponentProps){
    super(props);

    this.state = {
      showInfo: false
    };

    let dataDirection0 = [];
    let dataDirection1 = [];

    for(let i=0; i<24; i++){
      dataDirection0.push(this.props.demands[0].getDemand(new Time(i, 0)));
      dataDirection1.push(this.props.demands[1].getDemand(new Time(i, 0)));
    }

    let color0 = "rgba(234,92,92,0.5)";
    let color1 = "rgba(92,150,234,0.5)";

    this.state.chartData = {
    	labels: [0, "", "", "", "", "", 6, "", "", "", "", "", 12, "", "", "", "", 17, "", "", "", "", "", "", 24],
      datasets: [
    		{
          label: "Direction A",
    			backgroundColor: color0,
          borderColor: color0,
          pointRadius: 0,
    			data: dataDirection0
    		},
    		{
          label: "Direction B",
    			backgroundColor: color1,
          borderColor: color1,
          pointRadius: 0,
    			data: dataDirection1,
          borderWidth: 0
    		}
    	]
    };

  }


  onClickToggleInfo = () => {
    this.setState({
      showInfo: !this.state.showInfo
    });
  }

  render(){

    const props = this.props;

    return (
      <li style={!props.isLast? { borderLeftColor: props.color } : {}}>

        <a className="stylish-link" onClick={this.onClickToggleInfo}>
          <div className="timeline-circle" style={{ backgroundColor: props.color }}/>
          <div className="timeline-title">
            {props.name}
          </div>
        </a>

        {this.state.showInfo? (
          <div className="timeline-content">

            {props.estimate? (
              <p>New train in approximately {props.estimate} seconds.</p>
            ) : (
              <p>Predicting next train...</p>
            )}


            <div className="info-box">
              Demand for this station throughout the day, for both line directions.
            </div>
            <Line data={this.state.chartData} options={lineChartOptions}/>

          </div>
        ) : ""}


      </li>
    );
  }


};


export class TimeLine extends React.Component{

  props: TimeLineProps;

  constructor(props: TimeLineProps){
    super(props);
  }

  public render(){
    return (
      <div className="timeline-container">

        <ul className="timeline-list">

          {this.props.stationsPhysical.map((s, i) => (
            <StationInfoComponent
              key={i}
              isLast={i === this.props.stationsPhysical.length-1}
              name={s.name}
              color={this.props.color}
              estimate={
                this.props.estimates[i]? this.props.estimates[i][0] : null
              }
              demands={this.props.stations[i].demand}/>
          ))}

        </ul>

      </div>
    );
  }
}
