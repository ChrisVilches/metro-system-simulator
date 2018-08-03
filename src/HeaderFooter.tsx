import * as React from 'react';
import { Navbar, NavbarBrand, NavItem, Container } from "reactstrap";
import shanghaiMetro from "./images/shanghaimetro.png";
import './scss/HeaderFooter.scss';

export const NavComponent = (props) => (
  <Navbar expand="md">
    <Container>
      <NavbarBrand className="mr-auto align-items-center d-flex">
        <img src={shanghaiMetro} className="d-inline-block align-top logo-metro" alt=""/>
        <div className="header-title">Metro System Simulator</div>
      </NavbarBrand>
    </Container>
  </Navbar>
);

export const FooterComponent = (props) => (
  <footer className="container text-center footer">
    <div>
      <p>By Felo Vilches, 2018</p>
      <p>
        <a className="stylish-link" href="https://github.com/FeloVilches/i-like-trains" target="_blank">
          <i className="fa fa-github"/>
        </a>
      </p>
    </div>
  </footer>
);
