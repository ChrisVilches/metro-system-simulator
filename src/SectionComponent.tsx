import * as React from 'react';
import "./SectionComponent.css";

export interface SectionComponentProps{
  title: string;
  children: any;
}

export class SectionComponent extends React.Component{

  props: any;

  constructor(props){
    super(props);
  }

  public render(){
    return (
      <div className="section-container">
        <div className="section-header">{this.props.title}</div>
        <div className="section-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}
