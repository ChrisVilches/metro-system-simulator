import * as React from 'react';
import { Polyline } from "react-google-maps";
import { Circle, Marker } from "react-google-maps";
import PolyLine from "./PolyLine";

export interface LineMapDisplayProps {
 color: string;
 polyLine: PolyLine;
 stationLocations: any[];
 showStationMarkers: boolean;
}

export const LineMapDisplay: React.SFC<LineMapDisplayProps> = (props) => {
  return (
    <div>
      {props.showStationMarkers? (
        props.stationLocations.map((point, j) => (
          <Marker key={j} position={point} title={point.name}/>
        ))
      ) : null}


    <Polyline options={{ strokeColor: props.color, strokeWeight: 5, path: props.polyLine.points }}/>

  </div>
  );
}
