import * as React from 'react';
import { DropdownItem, Dropdown, DropdownMenu, DropdownToggle, Input } from "reactstrap";
import "./scss/SelectMobilePC.scss";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

export interface SelectMobilePCOption {
  label: string;
  value?: any;
  color?: string;
}

export interface SelectMobilePCProps {
  onResult: Function;
  options: SelectMobilePCOption[];
  defaultSelectedIndex: number;
}


class Option extends React.Component{

  props: any;

  selectThisOption = () => {
    this.props.onSelectOption(this.props.value)
  }

  render(){
    return (
      <DropdownItem onClick={this.selectThisOption}>
        <span style={{ color: this.props.color }}><i className="fa fa-sm fa-circle"/></span> {this.props.label}
      </DropdownItem>
    );
  }

}


export class SelectMobilePC extends React.Component<SelectMobilePCProps, any>{

  constructor(props){
    super(props);

    let defaultIndex: number = this.props.defaultSelectedIndex;
    if(typeof this.props.options[defaultIndex] === "undefined"){
      defaultIndex = 0;
    }

    this.state = {
      isMobile: isMobile.valueOf(),
      isOpen: false,
      selectedOption: defaultIndex
    };


  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  emitResult = (index) => {
    this.props.onResult({
      index,
      value: this.props.options[index]
    });

    this.setState({
      selectedOption: index
    });
  }

  onChange = (ev) => {
    this.emitResult(ev.target.value);
  }

  renderMobile: any = (props: SelectMobilePCProps) => {
    return (
      <Input type="select" value={this.state.selectedOption} onChange={this.onChange}>
        {props.options.map((opt, i) => (
          <option key={i} value={i}>{opt.label}</option>
        ))}
      </Input>
    );
  }

  renderPC: any = (props: SelectMobilePCProps) => {
    return (
      <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
        <DropdownToggle className="lines-dropdown" caret={true} style={{backgroundColor: props.options[this.state.selectedOption].color}}>
          {props.options[this.state.selectedOption].label}
        </DropdownToggle>
        <DropdownMenu
          modifiers={{
            setMaxHeight: {
              enabled: true,
              order: 890,
              fn: (data) => {
                return {
                  ...data,
                  styles: {
                    ...data.styles,
                    overflow: 'auto',
                    maxHeight: 300,
                  },
                };
              },
            },
          }}>

          {props.options.map((opt, i) => (
            <Option key={i} label={opt.label} color={opt.color} value={i} onSelectOption={this.emitResult}/>
          ))}

        </DropdownMenu>
      </Dropdown>

    );
  }


  render(){

    return this.state.isMobile? this.renderMobile(this.props) : this.renderPC(this.props);

  }

}
