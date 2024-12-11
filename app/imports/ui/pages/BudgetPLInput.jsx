import React from 'react';
import { Col, Container, Row, Card } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
import DisplayBudgetPLData from '../components/DisplayBudgetPLData';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';

const BudgetPLInput = () => {
  const { audBalData, ready } = useTracker(() => {
    const subscription = AuditedBalanceData.subscribeAudBalData();
    const rdy = subscription.ready();
    const data = AuditedBalanceData.find({}, { sort: { name: 1 } }).fetch();
    console.log(data);
    return {
      audBalData: data,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container id={PAGE_IDS.BUDGET_PL} className="py-3 justify-content-center">
      <Row className="justify-content-center pb-3">
        <Col className="text-center">
          <h2>Budget P&L Input</h2>
        </Col>
      </Row>
      <Row>
        <Col className="col-lg-4" style={{ paddingTop: '20px' }}>
          <Row className="fw-bold">
            Core Operating Budget Trend
            <hr className="solid" />
          </Row>
          <Row className="justify-content-start fw-bold">
            Revenue
          </Row>
          <Row className="align-items-center ps-3" style={{ paddingTop: '3px' }}>
            5% of the Investment Portfolio
          </Row>
          <Row className="align-items-center ps-3" style={{ paddingTop: '17px' }}>
            Revenues
          </Row>
          <Row className="align-items-center ps-3" style={{ paddingTop: '17px' }}>
            General Fund
          </Row>
          <Row className="align-items-center ps-3" style={{ paddingTop: '17px' }}>
            Core Operating Budget NOT Authorized
          </Row>
          <Row className="align-items-center ps-3" style={{ paddingTop: '6px' }}>
            <hr className="solid my-0" />
            <h6 className="text-end" style={{ paddingTop: '2px' }}>Total Revenue</h6>
          </Row>
          <Row className="justify-content-start fw-bold" style={{ paddingTop: '3px' }}>
            Expenses
          </Row>
          <Row className="align-items-center ps-3" style={{ paddingTop: '3px' }}>
            Personal
          </Row>
          <Row className="align-items-center ps-3 fw-bold">
            Personnel & Fringe (Admin):
          </Row>
          <Row className="align-items-center ps-5" style={{ paddingTop: '3px' }}>
            Salary
          </Row>
          <Row className="align-items-center ps-5 fw-bold" style={{ paddingTop: '3px' }}>
            Fringe Benefits:
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '5px' }}>
            Pension Accumulation
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Retiree Health Insurance
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Other Post-Employment Benefits
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Employees Health Fund
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Social Security
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Medicare
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Workers Compensation
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Unemployment Compensation
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Pension Administration
          </Row>
          <Row className="align-items-center ps-5 fw-bold" style={{ paddingTop: '3px' }}>
            Fringe Benefits
          </Row>
          <Row className="justify-content-start ps-3 fw-bold" style={{ paddingTop: '17px' }}>
            Personnel & Fringe (Admin)
          </Row>
          <Row className="justify-content-start ps-3 fw-bold" style={{ paddingTop: '3px' }}>
            Personnel & Fringe (Admin Staff):
          </Row>
          <Row className="align-items-center ps-5" style={{ paddingTop: '3px' }}>
            Salary
          </Row>
          <Row className="align-items-center ps-5 fw-bold" style={{ paddingTop: '3px' }}>
            Fringe Benefits:
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '5px' }}>
            Pension Accumulation
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Retiree Health Insurance
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Other Post-Employment Benefits
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Employees Health Fund
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Social Security
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Medicare
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Workers Compensation
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Unemployment Compensation
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Pension Administration
          </Row>
          <Row className="align-items-center ps-5 fw-bold" style={{ paddingTop: '3px' }}>
            Fringe Benefits
          </Row>
          <Row className="justify-content-start ps-3 fw-bold" style={{ paddingTop: '17px' }}>
            Personnel & Fringe (Management Staff)
          </Row>
          <Row className="justify-content-start ps-3 fw-bold" style={{ paddingTop: '3px' }}>
            Personnel & Fringe (Management):
          </Row>
          <Row className="align-items-center ps-5" style={{ paddingTop: '3px' }}>
            Salary
          </Row>
          <Row className="align-items-center ps-5 fw-bold" style={{ paddingTop: '3px' }}>
            Fringe Benefits:
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '5px' }}>
            Pension Accumulation
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Retiree Health Insurance
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Other Post-Employment Benefits
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Employees Health Fund
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Social Security
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Medicare
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Workers Compensation
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Unemployment Compensation
          </Row>
          <Row className="align-items-center ms-3 ps-5" style={{ paddingTop: '3px' }}>
            Pension Administration
          </Row>
          <Row className="align-items-center ps-5 fw-bold" style={{ paddingTop: '3px' }}>
            Fringe Benefits
          </Row>
          <Row className="justify-content-start ps-3 fw-bold" style={{ paddingTop: '3px' }}>
            Personnel & Fringe (Management):
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Program
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Contracts
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Grants
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Travel
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Equipment
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Overhead
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Debt Service
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Other
          </Row>
          <Row className="justify-content-start fw-bold" style={{ paddingTop: '3px' }}>
            Total Expenses
          </Row>
          <Row className="justify-content-start fw-bold" style={{ paddingTop: '17px' }}>
            Surplus (Deficit)
          </Row>
          <Row className="justify-content-start ps-3 fw-bold" style={{ paddingTop: '3px' }}>
            Expenditure line items per audited financials
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '7px' }}>
            Management
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Support Services
          </Row>
          <Row className="justify-content-start ps-3" style={{ paddingTop: '17px' }}>
            Beneficiary Advocacy
          </Row>
        </Col>
        <Col lg={8}>
          <Card className="border-0">
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '0px', marginTop: '0' }}>
              <div style={{ display: 'inline-flex', gap: '5' +
                  'px', maxWidth: '100%', marginTop: '0' }}
              >
                {audBalData.map((data) => (
                  <div
                    key={data._id}
                    style={{
                      minWidth: '250px',
                      padding: '0', // Remove all padding
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#f8f9fa',
                    }}
                  >
                    <DisplayBudgetPLData audBalData={data} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Data" />);
};

export default BudgetPLInput;
