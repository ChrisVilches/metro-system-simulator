import * as React from 'react';
import { Polyline } from "react-google-maps";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Circle } from "react-google-maps";

class MyMap extends React.Component{

  props: any;

  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(ev){
    this.props.onGetClickCoordinates(ev.latLng.lat(), ev.latLng.lng());
  }

  public render(){
    return (
      <GoogleMap onClick={this.onClick} {...this.props}>

        <Polyline options={{ strokeColor: "#000000", strokeWeight: 6, path: this.props.debugPoints }}/>

        {this.props.children}

        {this.props.trains.map((train, i) => (
          <Circle key={i} radius={70} options={{ fillColor: "#888888", center: train.pos }}/>
        ))}

      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCEIYXsTt_tNmYVVOuAgUtk8NZyC_bCZFs&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(MyMap);
