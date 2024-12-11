import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { ROLE } from '../../api/role/Role';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { AccountantProfiles } from '../../api/user/AccountantProfileCollection';
import { BossAccountantProfiles } from '../../api/user/BossAccountantProfileCollection';
import ClientListOfWorksheetsItem from '../components/ClientListOfWorksheetsItem';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
import { WP2503 } from '../../api/WP2503/WP2503';

const ClientList = () => {
  const { clientWorksheetList, accountantSubReady, auditedBalanceDataSubReady, wp2503SubReady } = useTracker(() => {
    const user = Meteor.user();
    let acctSub;
    let acctSubRdy;
    let clientsFind;
    let clients;
    const auditedBalanceDataSub = AuditedBalanceData.subscribeAudBalDataAdmin();
    const audBalDataSubRdy = auditedBalanceDataSub.ready();
    const wp2503Sub = WP2503.subscribeWP2503Admin();
    const wp2503SubRdy = wp2503Sub.ready();
    const clntList = [];

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
        const newClient = {
          clientEmail: client,
          worksheetsAuditedBalance: [],
          worksheets2503: [],
        };
        AuditedBalanceData.find({ owner: client }).fetch().forEach((worksheet) => {
          if (!newClient.worksheetsAuditedBalance.includes(worksheet.worksheetName)) {
            newClient.worksheetsAuditedBalance.push(worksheet.worksheetName);
          }
        });
        WP2503.find({ owner: client }).fetch().forEach((worksheet) => {
          if (!newClient.worksheets2503.includes(worksheet.worksheetName)) {
            newClient.worksheets2503.push(worksheet.worksheetName);
          }
        });
        clntList.push(newClient);
        console.log(clntList);
      });
    }

    return {
      clientWorksheetList: clntList,
      accountantSubReady: acctSubRdy,
      auditedBalanceDataSubReady: audBalDataSubRdy,
      wp2503SubReady: wp2503SubRdy,
    };
  }, []);
  return (accountantSubReady && auditedBalanceDataSubReady && wp2503SubReady) ? (
    <Container id={PAGE_IDS.LIST_CLIENTS} className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center"><h2>Your Clients</h2></Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Client Email</th>
                <th>Financial Worksheets</th>
              </tr>
            </thead>
            <tbody>
              {clientWorksheetList.map((profile) => <ClientListOfWorksheetsItem key={profile._id} profile={profile} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ClientList;
