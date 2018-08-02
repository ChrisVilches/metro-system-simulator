import * as React from 'react';
import "./TimeLine.css";





export default class TimeLine extends React.Component{

  props: any;

  constructor(props){
    super(props);
  }

  public render(){
    return (
      <section className="block-content t-block-teal l-block-spacing">
        <div className="l-contained">
          {/*<header className="heading-group">
            <h2>Timeline</h2>
            <p className="subtitle">
              What is this?
            </p>
          </header>*/}
          <ul className="timeline-list">

            {this.props.stations.map((s, i) => (
              <li key={i}>
                <div className="content">
                  <h3>{s.name}</h3>

                  <p>In approximately {this.props.estimates[i][0]} seconds.</p>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quam felis, rutrum nec enim non, sodales facilisis purus. Vestibulum viverra egestas ipsum eget commodo. Nullam aliquet lorem vitae nulla dictum vestibulum sed quis tellus. Sed diam diam, facilisis tincidunt volutpat nec, auctor quis magna. Proin sed nunc iaculis ipsum scelerisque tincidunt. Cras eleifend leo tellus, fermentum finibus tortor fringilla eu.
                  </p>
                </div>
              </li>
            ))}
          </ul>

        </div>

      </section>
    );
  }
}
