import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Loader from './hoc/Loader';
import React from 'react';
import Navigation from './ui/Navigation';

export default function Layout({ user, logoutHandler }) {
  return (
    <Container>
      <Row className="d-flex justify-content-md-center">
        <Loader isLoading={user === undefined}>
          <Row>
            <Col xs={12}>
              <Navigation user={user} logoutHandler={logoutHandler} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <main>
                <Outlet />
              </main>
            </Col>
          </Row>
        </Loader>
      </Row>
    </Container>
  );
}
