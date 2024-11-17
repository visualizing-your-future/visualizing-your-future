import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, CloudDownload, PersonFill, PersonPlusFill, Table } from 'react-bootstrap-icons';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);
  const menuStyle = { marginBottom: '0px' };
  return (
    <Navbar bg="light" expand="lg" style={menuStyle} className="justify-content-center px-5">
      <Container className="d-flex justify-content-between custom-navbar-spacing">
        <Navbar.Brand id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} to="/">
          <img src="/images/logo.png" className="rounded" alt="visualizing your future logo" width={90} />
          <div className="logo-text ms-2">
            <span className="fw-bold">VISUALIZING</span>
            <span className="fw-bold">YOUR FUTURE</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={COMPONENT_IDS.NAVBAR_COLLAPSE} id="nav-toggle" />
        <Navbar.Collapse id={COMPONENT_IDS.NAVBAR_COLLAPSE}>
          <Nav className="me-auto justify-content-start">
            {currentUser && Roles.userIsInRole(Meteor.userId(), [ROLE.USER]) ? ([
            ]) : ''}
            {currentUser && Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? ([
              <Nav.Link id={COMPONENT_IDS.NAVBAR_ADMIN} as={NavLink} to="/admin" key="admin">Admin (WIP)</Nav.Link>,
              <Nav.Link id={COMPONENT_IDS.NAVBAR_LIST_PROFILES_ADMIN} as={NavLink} to="/profiles" key="profiles">Edit User Accounts</Nav.Link>,
              <Nav.Link id={COMPONENT_IDS.NAVBAR_CLIENT_DATA} as={NavLink} to="/clients" key="clients">Client Page (Does not work)</Nav.Link>,
            ]) : ''}
            {currentUser && Roles.userIsInRole(Meteor.userId(), [ROLE.ACCOUNTANT, ROLE.BOSSACCOUNTANT]) ? ([
              <Nav.Link id={COMPONENT_IDS.NAVBAR_CLIENT_LIST} as={NavLink} to="/clientList" key="clientList">Clients</Nav.Link>,
              <Nav.Link id={COMPONENT_IDS.NAVBAR_DATA_INPUT} as={NavLink} to="/dataInput" key="dataInput">Audited Balance</Nav.Link>,
              <NavDropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} title="Workpapers" key="wp-dropdown">
                <NavDropdown.Item id={COMPONENT_IDS.WP_1007} as={NavLink} to="/wp1007" key="1007"><Table /> 1007</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.WP_1008} as={NavLink} to="/wp1008" key="1008"><Table /> 1008</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.WP_2005_2} as={NavLink} to="/wp2005-2" key="2005-2"><Table /> 2005-2</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.WP_2503} as={NavLink} to="/wp2503" key="2503"><Table /> 2503</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.WP_4001} as={NavLink} to="/wp4001" key="4001"><Table /> 4001</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.WP_4002} as={NavLink} to="/wp4002" key="4002"><Table /> 4002</NavDropdown.Item>
              </NavDropdown>,
              <Nav.Link id={COMPONENT_IDS.NAVBAR_VISUALIZATION_EXPORT} as={NavLink} to="/visualizationExport" key="visualizationExport">Visualization</Nav.Link>,
            ]) : ''}
            {currentUser && Roles.userIsInRole(Meteor.userId(), [ROLE.BOSSACCOUNTANT]) ? ([
              <Nav.Link id={COMPONENT_IDS.NAVBAR_CLIENT_LIST} as={NavLink} to="/clientList" key="clientList">Clients</Nav.Link>,
              <Nav.Link id={COMPONENT_IDS.NAVBAR_CLIENT_DATA} as={NavLink} to="/clientDataImport" key="clients">Client Data</Nav.Link>,
              <Nav.Link id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE} as={NavLink} to="/manage-database" key="manage-database"><CloudDownload /> Database</Nav.Link>,
            ]) : ''}
            {currentUser && Roles.userIsInRole(Meteor.userId(), [ROLE.CLIENT]) ? ([
            ]) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} title="Login" className="custom-login-button">
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} as={NavLink} to="/signin"><PersonFill />Sign in</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} as={NavLink} to="/signup"><PersonPlusFill />Sign up</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} title={currentUser} className="custom-login-button">
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_USER_ACCOUNT_SETTINGS} as={NavLink} to="/userAccountSettings"><BoxArrowRight /> Account Settings</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} as={NavLink} to="/signout"><BoxArrowRight /> Sign out</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
