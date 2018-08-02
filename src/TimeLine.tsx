import * as React from 'react';
import "./TimeLine.css";
import { Line } from "react-chartjs";
import Station from "./management/Station";
import IDemand from "./management/IDemand";
import Time from "./management/Time";

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

    this.state.chartData = {
    	labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      datasets: [
    		{
    			fillColor: "rgba(220,220,220,0.2)",
    			strokeColor: "rgba(220,220,220,1)",
    			pointColor: "rgba(220,220,220,1)",
    			pointStrokeColor: "#fff",
    			pointHighlightFill: "#fff",
    			pointHighlightStroke: "rgba(220,220,220,1)",
    			data: dataDirection0
    		},
    		{
    			fillColor: "rgba(151,187,205,0.2)",
    			strokeColor: "rgba(151,187,205,1)",
    			pointColor: "rgba(151,187,205,1)",
    			pointStrokeColor: "#fff",
    			pointHighlightFill: "#fff",
    			pointHighlightStroke: "rgba(151,187,205,1)",
    			data: dataDirection1
    		}
    	]
    };

    this.onClickToggleInfo = this.onClickToggleInfo.bind(this);
  }


  onClickToggleInfo(){
    this.setState({
      showInfo: !this.state.showInfo
    });
  }

  render(){
    return (
      <li>
        <div className="content">
          {!this.props.isLast? (
            <div>
              <div className="timeline-line" style={{ borderColor: this.props.color }}/>
            </div>
          ) : ""}

          <a onClick={this.onClickToggleInfo}>
            <div className="timeline-circle" style={{ backgroundColor: this.props.color }}/>
            <h4>{this.props.name}</h4>
        </a>

          {this.state.showInfo? (
            <div>
              <p>New train in approximately {this.props.estimate} seconds.</p>

              <div>
                <button className="btn-primary">
                  Useless button
                </button>
              </div>
              {this.state.showDemand? (
                <Line data={this.state.chartData} options={lineChartOptions} width="600" height="180"/>
              ) : ""}
            </div>
          ) : ""}



        </div>
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
      <section className="block-content t-block-teal l-block-spacing">
        <div className="l-contained">

          <ul className="timeline-list">

            {this.props.stationsPhysical.map((s, i) => (
              <StationInfoComponent key={i} isLast={i === this.props.stationsPhysical.length-1} name={s.name} color={this.props.color} estimate={this.props.estimates[i][0]} demands={this.props.stations[i].demand}/>
            ))}

          </ul>

        </div>

      </section>
    );
  }
}
