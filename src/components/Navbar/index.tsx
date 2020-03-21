import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

import Logo from "components/Logo";
import { useStateValue } from "store/state";

import "./index.scss";

export default () => {
  const { state } = useStateValue();
  const checkedLogin = state.auth.checked;
  const loggedIn = state.auth.loggedIn;

  return (
    <Navbar className='main' bg="light" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <Logo /> Nils
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link as={NavLink} to="/" exact>
            Home
          </Nav.Link>
          {(!checkedLogin) && (
            <Nav.Item>
              <FontAwesomeIcon icon="spinner" pulse />
            </Nav.Item>
          )}
          {(checkedLogin && !loggedIn) && (
            <Nav.Link as={NavLink} to="/login" exact>
              <FontAwesomeIcon icon="sign-in-alt" /> Sign In
            </Nav.Link>
          )}
          {(checkedLogin && loggedIn) && (
            <Nav.Link as={NavLink} to="/dashboard" exact>
              Dashboard
            </Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
