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

        {this.props.lines.map((line, i) => (
          line.path.filter(x => x.hasOwnProperty("station")).map((point, j) => (
            <Marker key={j} position={point} title={point.station}/>
          ))
        ))}

        {this.props.trains.map((train, i) => (
          <Circle key={i} radius={70} options={{ fillColor: "#006600", center: train.pos }}/>
        ))}

        {this.props.lines.map((line, i) => (
          <Polyline key={i} options={{ strokeColor: line.color, path: line.path }}/>
        ))}

      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD5PGtbPYazRn4cBzGmuaLSdxvRCAIq9Xc&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(MyMap);
