import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => (
  // Main footer container with padding and margin for spacing
  <div className="footer py-3 mt-auto">
    <Container>
      <Row>
        {/* About Spire section with links */}
        <Col md={3}>
          <h5 className="text-uppercase">About Spire</h5>
          <ul className="list-unstyled">
            <li><a href="https://www.spirehawaii.com/firm/our-philosophy" className="text-decoration-none">Spire Philosophy</a></li>
            <li><a href="https://www.spirehawaii.com/firm/our-team" className="text-decoration-none">Spire Team</a></li>
            <li><a href="https://www.spirehawaii.com/careers" className="text-decoration-none">Careers</a></li>
            <li><a href="https://visualizing-your-future.github.io" className="text-decoration-none">VYF Mission</a></li>
          </ul>
        </Col>

        {/* Services Provided section with links */}
        <Col md={3}>
          <h5 className="text-uppercase">Services Provided</h5>
          <ul className="list-unstyled">
            <li><a href="https://visualizing-your-future.github.io" className="text-decoration-none">Data Visualization</a></li>
            <li><a href="https://www.spirehawaii.com/our-services" className="text-decoration-none">Consulting</a></li>
          </ul>
        </Col>

        {/* Contact information section */}
        <Col md={3}>
          <h5 className="text-uppercase">Contact Us</h5>
          <address className="text-black">
            700 Bishop Street,<br />
            Suite 2001,<br />
            Honolulu, HI 96813<br />
            (808) 536-0066<br />
            <a href="mailto:contactus@spirehi.com" className="text-decoration-none">contactus@spirehi.com</a>
          </address>
        </Col>

        {/* Social media icons section */}
        <Col md={3}>
          <h5 className="text-uppercase">Follow Us</h5>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a href="https://www.linkedin.com/company/spire-hawaii-llp" aria-label="LinkedIn" className="social-icon fs-4">
                <FaLinkedin />
              </a>
            </li>
            <li className="list-inline-item">
              <a href="https://www.instagram.com/spirehawaii/" aria-label="Instagram" className="social-icon fs-4">
                <FaInstagram />
              </a>
            </li>
            <li className="list-inline-item">
              <a href="https://x.com/i/flow/login?redirect_after_login=%2Fspirehawaii" aria-label="Twitter" className="social-icon fs-4">
                <FaTwitter />
              </a>
            </li>
          </ul>
        </Col>
      </Row>

      {/* Logo section with company logos */}
      <Row className="my-4">
        <Col className="text-center">
          <img
            src="/images/logo.png"
            alt="Visualizing Your Future"
            width={70}
            className="rounded footer-logo mx-2"
          />
          <img
            src="/images/spire-logo.png"
            alt="Partner Logo 1"
            width={120}
            className="footer-logo mx-2"
          />
        </Col>
      </Row>

      {/* Footer bottom section with copyright text */}
      <Row>
        <Col className="text-center text-black py-3 border-top border-light">
          © Visualizing Your Future | Developed for Spire Hawaii LLP 2023
        </Col>
      </Row>
    </Container>
  </div>
);

export default Footer;
