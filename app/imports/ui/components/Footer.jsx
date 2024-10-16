import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer">
    <Container>
      <hr />
      <Row>
        <Col md={3}>
          <h5>ABOUT SPIRE</h5>
          <ul className="list-unstyled">
            <li><a href="https://www.spirehawaii.com/firm/our-philosophy">Spire Philosophy</a></li>
            <li><a href="https://www.spirehawaii.com/firm/our-team">Spire Team</a></li>
            <li><a href="https://www.spirehawaii.com/careers">Careers</a></li>
            <li><a href="https://visualizing-your-future.github.io">VYF Mission</a></li>
          </ul>
        </Col>

        <Col md={3}>
          <h5>SERVICES PROVIDED</h5>
          <ul className="list-unstyled">
            <li><a href="https://visualizing-your-future.github.io">Data Visualization</a></li>
            <li><a href="https://www.spirehawaii.com/our-services">Consulting</a></li>
          </ul>
        </Col>

        <Col md={3}>
          <h5>CONTACT US</h5>
          <address>
            700 Bishop Street,<br />
            Suite 2001,<br />
            Honolulu, HI 96813<br />
            (808) 536-0066<br />
            <a href="mailto:contactus@spirehi.com">contactus@spirehi.com</a>
          </address>
        </Col>

        <Col md={3}>
          <h5>FOLLOW US</h5>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a href="https://www.linkedin.com/company/spire-hawaii-llp" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </li>
            <li className="list-inline-item">
              <a href="https://www.instagram.com/spirehawaii/" aria-label="Instagram">
                <FaInstagram />
              </a>
            </li>
            <li className="list-inline-item">
              <a href="https://x.com/i/flow/login?redirect_after_login=%2Fspirehawaii" aria-label="Twitter">
                <FaTwitter />
              </a>
            </li>
          </ul>
        </Col>
      </Row>

      <Row className="my-4">
        <Col className="text-center">
          <img
            src="/images/logo.png"
            alt="Visualizing Your Future"
            width={70}
            className="rounded mx-2"
          />
          <img
            src="/images/spire-logo.png"
            alt="Partner Logo 1"
            width={100}
            className="footer-logo mx-2"
          />
        </Col>
      </Row>

      <Row>
        <Col className="text-center py-3">
          © Visualizing Your Future | Developed for Spire Hawaii LLP 2023
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
