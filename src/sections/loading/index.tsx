import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Navbar from "components/Navbar";
import Loader from "components/Loader";

export default () => {
  return (
    <>
      <header>
        <div className="bg-angle" />
        <section>
          <Navbar />
          <Container>
            <Row>
              <Col md={{ span: 6, offset: 3 }}>
                <div className='text-center mt-5'>
                  <h4 className='my-2' style={{ color: '#fff' }}>
                    <Loader />
                  </h4>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </header>
    </>
  );
};
