import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./index.scss";

type Props = {};

export default (props: Props) => {
  const year = (new Date()).getFullYear();
  return (
    <footer>
      <div className="company">
        <Container>
          <Row>
            <Col>Made with <FontAwesomeIcon icon='heart' /> in London, UK</Col>
            <Col className='text-right'>
              &copy; butt <small>{ year }</small>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}