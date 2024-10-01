import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer bg-light">
    <Container>
      <hr />
      <Row>
        <Col md={3}>
          <h5>ABOUT US</h5>
          <ul className="list-unstyled">
            <li><a href="https://visualizing-your-future.github.io">Who We Are</a></li>
            <li><a href="https://visualizing-your-future.github.io">Place Holder</a></li>
          </ul>
        </Col>

        <Col md={3}>
          <h5>SERVICES PROVIDED</h5>
          <ul className="list-unstyled">
            <li><a href="https://visualizing-your-future.github.io">Data Visualization</a></li>
          </ul>
        </Col>

        <Col md={3}>
          <h5>CONTACT US</h5>
          <address>
            ADDRESS <br />
            OF SPIRE<br />
            OR US<br />
          </address>
        </Col>

        <Col md={3} className="text-center">
          <h5>FOLLOW US</h5>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a href="https://www.linkedin.com/company/spire-hawaii-llp" aria-label="LinkedIn"><FaLinkedin /></a>
            </li>
            <li className="list-inline-item">
              <a href="https://www.instagram.com/spirehawaii/" aria-label="Instagram"><FaInstagram /></a>
            </li>
            <li className="list-inline-item">
              <a href="https://x.com/i/flow/login?redirect_after_login=%2Fspirehawaii" aria-label="Twitter"><FaTwitter /></a>
            </li>
          </ul>
        </Col>
      </Row>
      <Row>
        <Col className="text-center py-3">
          Visualizing Your Future | Developed for Spire Hawaii LLP
        </Col>
      </Row>
      <Row>
        <Col md={12} className="text-center">
          <a href="https://visualizing-your-future.github.io" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/logo.png"
              alt="Visualizing Your Future"
              width={70}
              className="rounded"
            />
          </a>
          <img
            src="/images/spire-logo.png"
            alt="Partner Logo 1"
            width={100}
            className="footer-logo mx-2"
          />
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
