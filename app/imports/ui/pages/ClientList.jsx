import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { ROLE } from '../../api/role/Role';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { ClientProfiles } from '../../api/user/ClientProfileCollection';
import { AccountantProfiles } from '../../api/user/AccountantProfileCollection';
import { BossAccountantProfiles } from '../../api/user/BossAccountantProfileCollection';
import ClientListOfWorksheetsItem from '../components/ClientListOfWorksheetsItem';

const ClientList = () => {
  const { clientList, accountantSubReady, clientSubReady } = useTracker(() => {
    const user = Meteor.user();
    let acctSub;
    let acctSubRdy;
    let clientsFind;
    let clients;
    const clientSub = ClientProfiles.subscribeClientProfilesAdmin();
    const clientSubRdy = clientSub.ready();
    const clientProfiles = ClientProfiles.find({}).fetch();
    const clientListObjects = [];

    if (Roles.userIsInRole(user, ROLE.ACCOUNTANT)) {
      acctSub = AccountantProfiles.subscribeAccountantProfilesUser();
      acctSubRdy = acctSub.ready();
      clientsFind = AccountantProfiles.findOne({ email: user.emails[0].address });
      // This is required or the app crashes.
      if (clientsFind) {
        clients = clientsFind.clients;
      }
    } else if (Roles.userIsInRole(user, ROLE.BOSSACCOUNTANT)) {
      acctSub = BossAccountantProfiles.subscribeBossAccountantProfilesUser();
      acctSubRdy = acctSub.ready();
      clientsFind = BossAccountantProfiles.findOne({ email: user.emails[0].address });
      // This is required or the app crashes.
      if (clientsFind) {
        clients = clientsFind.clients;
      }
    }

    // This is required or the app crashes.
    if (clients) {
      clients.forEach((client) => {
        const test = ClientProfiles.findOne({ email: client });
        clientListObjects.push(test);
      });
    }

    return {
      clientList: clientListObjects,
      accountantSubReady: acctSubRdy,
      clientProfileItems: clientProfiles,
      clientSubReady: clientSubRdy,
    };
  }, []);
  return (clientSubReady && accountantSubReady) ? (
    <Container id={PAGE_IDS.LIST_CLIENTS} className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center"><h2>Your Clients</h2></Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Financial Worksheets</th>
              </tr>
            </thead>
            <tbody>
              {clientList.map((profile) => <ClientListOfWorksheetsItem key={profile._id} profile={profile} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ClientList;
