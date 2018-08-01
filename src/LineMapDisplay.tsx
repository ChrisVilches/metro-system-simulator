import * as React from 'react';
import { Polyline } from "react-google-maps";
import { Circle, Marker } from "react-google-maps";
import PolyLine from "./PolyLine";

export interface LineMapDisplayProps {
 color: string;
 polyLine: PolyLine;
 stationLocations: any[];
}

export const LineMapDisplay: React.SFC<LineMapDisplayProps> = (props) => {
  return (
    <div>
    {props.stationLocations.map((point, j) => (
      <Marker key={j} position={point} title={point.name}/>
    ))}

    <Polyline options={{ strokeColor: props.color, path: props.polyLine.points }}/>

  </div>
  );
}
