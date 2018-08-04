import * as React from "react";
import "./scss/AboutCarousel.scss";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Slide = (props) => {
  return (
    <div {...props}>
      <div className="carousel-item align-items-center d-flex">
        <div className="text-center" style={{width: "100%"}}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default class AboutCarousel extends React.Component {

  constructor(props){
    super(props);
  }

  shouldComponentUpdate(){
    return false;
  }

  render() {

    return (
      <Carousel autoPlay={true} interval={10000} infiniteLoop={true} showThumbs={false}>
        <Slide className="about-carousel-item-1">
          This is a train system simulator.
          It was created mainly with the purpose of developing and testing different AI and scheduling algorithms.
        </Slide>
        <Slide className="about-carousel-item-2">
          It was made using React, Typescript, Bootstrap, and many other tools.
        </Slide>
        <Slide className="about-carousel-item-3">
          Add more info... ad ad adas asd asd asdas d
        </Slide>
      </Carousel>
    );

  }
}
