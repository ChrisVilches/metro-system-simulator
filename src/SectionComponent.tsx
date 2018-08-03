import * as React from 'react';
import "./scss/SectionComponent.scss";

export interface SectionComponentProps{
  title: string;
  children: any;
  faIcon?: string;
}

export const SectionComponent = (props: SectionComponentProps) => (
  <div className="section-container">
    <div className="section-header">
      {props.faIcon? (
        <i className={`fa fa-sm fa-${props.faIcon} icon-section`}/>
      ) : null}
      {props.title}
    </div>
    <div className="section-body">
      {props.children}
    </div>
  </div>
);
