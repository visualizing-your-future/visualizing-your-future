import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import DataInput from '../pages/DataInput';
import DataInputEmail from '../pages/DataInputEmail';
import BudgetPLInput from '../pages/BudgetPLInput';
import WP2503Page from '../pages/WP2503Page';
import WP2503PageEmail from '../pages/WP2503PageEmail';
import Admin from '../pages/Admin';
import ListProfiles from '../pages/ListProfiles';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';
import SignOut from '../pages/SignOut';
import AccountSettings from '../pages/AccountSettings';
import NavBar from '../components/NavBar';
import SignIn from '../pages/SignIn';
import NotAuthorized from '../pages/NotAuthorized';
import { ROLE } from '../../api/role/Role';
import LoadingSpinner from '../components/LoadingSpinner';
import ManageDatabase from '../pages/ManageDatabase';
import ClientData from '../pages/ClientData';
import ClientDataImport from '../pages/ClientDataImport';
import VisualizationExport from '../pages/VisualizationExport';
import EditProfile from '../pages/EditProfile';
import ClientList from '../pages/ClientList';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const { ready } = useTracker(() => {
    const rdy = Roles.subscription.ready();
    return {
      ready: rdy,
    };
  });
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/userAccountSettings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          <Route path="/landing" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          <Route path="/dataInput" element={<AllAccountantProtectedRoute ready={ready}><DataInput /></AllAccountantProtectedRoute>} />
          <Route path="/clientDataImport" element={<BossAccountantProtectedRoute ready={ready}><ClientDataImport /></BossAccountantProtectedRoute>} />
          <Route path="/edit/:_id" element={<AdminProtectedRoute ready={ready}><EditProfile /></AdminProtectedRoute>} />
          <Route path="/visualizationExport" element={<AllAccountantProtectedRoute ready={ready}><VisualizationExport /></AllAccountantProtectedRoute>} />
          <Route path="/dataInput" element={<AllAccountantProtectedRoute ready={ready}><DataInput /></AllAccountantProtectedRoute>} />
          <Route path="/dataInput/:_email/:_worksheetName" element={<AllAccountantProtectedRoute ready={ready}><DataInputEmail /></AllAccountantProtectedRoute>} />
          <Route path="/budgetPLInput" element={<AllAccountantProtectedRoute ready={ready}><BudgetPLInput /></AllAccountantProtectedRoute>} />
          <Route path="/wp2503" element={<AllAccountantProtectedRoute ready={ready}><WP2503Page /></AllAccountantProtectedRoute>} />
          <Route path="/wp2503/:_email/:_worksheetName" element={<AllAccountantProtectedRoute ready={ready}><WP2503PageEmail /></AllAccountantProtectedRoute>} />
          <Route path="/clientDataImport" element={<ProtectedRoute><ClientDataImport /></ProtectedRoute>} />
          <Route path="/edit/:_id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/visualizationExport" element={<ProtectedRoute><VisualizationExport /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminProtectedRoute ready={ready}><Admin /></AdminProtectedRoute>} />
          <Route path="/profiles" element={<AdminProtectedRoute ready={ready}><ListProfiles /></AdminProtectedRoute>} />
          <Route path="/manage-database" element={<BossAccountantProtectedRoute ready={ready}><ManageDatabase /></BossAccountantProtectedRoute>} />
          <Route path="/clients" element={<AdminProtectedRoute ready={ready}><ClientData /></AdminProtectedRoute>} />
          <Route path="/clientList" element={<AllAccountantProtectedRoute ready={ready}><ClientList /></AllAccountantProtectedRoute>} />
          <Route path="/notauthorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */

const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  return isLogged ? children : <Navigate to="/signin" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};

/**
 * AccountantProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AccountantProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAccountant = Roles.userIsInRole(Meteor.userId(), [ROLE.ACCOUNTANT]);
  return (isLogged && isAccountant) ? children : <Navigate to="/notauthorized" />;
};

/**
 * BossAccountantProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const BossAccountantProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isBossAccountant = Roles.userIsInRole(Meteor.userId(), [ROLE.BOSSACCOUNTANT]);
  return (isLogged && isBossAccountant) ? children : <Navigate to="/notauthorized" />;
};

/**
 * AllAccountantProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AllAccountantProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAllAccountant = Roles.userIsInRole(Meteor.userId(), [ROLE.BOSSACCOUNTANT, ROLE.ACCOUNTANT]);
  return (isLogged && isAllAccountant) ? children : <Navigate to="/notauthorized" />;
};

/**
 * ClientProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ClientProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isClient = Roles.userIsInRole(Meteor.userId(), [ROLE.CLIENT]);
  return (isLogged && isClient) ? children : <Navigate to="/notauthorized" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

// Require a component and location to be passed to each AccountantProtectedRoute.
AccountantProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AccountantProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

// Require a component and location to be passed to each BossAccountantProtectedRoute.
BossAccountantProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

BossAccountantProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

// Require a component and location to be passed to each AllAccountantProtectedRoute.
AllAccountantProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AllAccountantProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

// Require a component and location to be passed to each ClientProtectedRoute.
ClientProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ClientProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

export default App;
