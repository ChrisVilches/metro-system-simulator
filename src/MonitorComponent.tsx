import * as React from 'react';

export interface MonitorComponentProps{
  danger: number;
}

export const MonitorComponent = (props: MonitorComponentProps) => (
  <div>Danger: {props.danger}</div>
);
