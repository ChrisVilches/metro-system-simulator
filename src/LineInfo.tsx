import * as React from 'react';

export default class LineInfo extends React.Component {

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
