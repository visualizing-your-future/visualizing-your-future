import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
import DisplayAudBalData from '../components/DisplayAudBalData';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';

const DataInput = () => {
  const { audBalData, ready } = useTracker(() => {
    const subscription = AuditedBalanceData.subscribeAudBalData();
    const rdy = subscription.ready();
    const data = AuditedBalanceData.find({}, { sort: { name: 1 } }).fetch();
    return {
      audBalData: data,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container id={PAGE_IDS.DATA_STUFF} className="py-3">
      <Row className="justify-content-center pb-3">
        <Col className="text-center">
          <h2>Audited Balance Sheet Temp</h2>
        </Col>
      </Row>
      <Row>
        <Col className="col-lg-3">
          <Row className="fw-bold">
            Fiscal Year
          </Row>
        </Col>
        <Col className="col-lg-9">
          <Row className="justify-content-start">
            <Col className="col-lg-2">Year XX</Col>
          </Row>
        </Col>
        <hr className="solid" />
      </Row>
      <Row>
        <Col className="col-lg-3">
          <Row className="justify-content-start fw-bold">
            Cash and Cash Equivalents
          </Row>
          <Row className="align-items-center px-3">
            Petty Cash
          </Row>
          <Row className="align-items-center px-3">
            Cash
          </Row>
          <Row className="align-items-center px-3">
            Cash in banks/Draw on Line of Credit
          </Row>
          <Row className="align-items-center px-3 ">
            <hr className="solid my-0" />
            <h6 className="text-end">Total Cash and Cash Equivalents</h6>
          </Row>
          <Row className="justify-content-start">
            <h6>Other Assets</h6>
          </Row>
          <Row className="align-items-center px-3">
            Accounts Receivable
          </Row>
          <Row className="align-items-center px-3">
            Due from other fund
          </Row>
          <Row className="align-items-center px-3">
            Interest and dividends receivable
          </Row>
          <Row className="align-items-center px-3">
            Inventory, prepaid items and other assets
          </Row>
          <Row className="align-items-center px-3">
            Notes receivable - due within one year
          </Row>
          <Row className="align-items-center px-3">
            Notes receivable - due after one year
          </Row>
          <Row className="align-items-center px-3">
            Security Deposits
          </Row>
          <Row className="align-items-center px-3">
            Cash held by investment manager
          </Row>
          <Row className="align-items-center px-3 ">
            <hr className="solid my-0" />
            <h6 className="text-end">Total Other</h6>
          </Row>
          <Row className="align-items-center">
            <h6>Investments:</h6>
          </Row>
          <Row className="align-items-center px-3">
            Mutual Funds
          </Row>
          <Row className="align-items-center px-3 ">
            Commingled Funds
          </Row>
          <Row className="align-items-center px-3 ">
            Hedge Funds
          </Row>
          <Row className="align-items-center px-3 ">
            Private Equity
          </Row>
          <Row className="align-items-center px-3 ">
            Common Trust Fund
          </Row>
          <Row className="align-items-center px-3 ">
            Common & Preferred Stock
          </Row>
          <Row className="align-items-center px-3 ">
            Private Debt
          </Row>
          <Row className="align-items-center px-3 ">
            Other
          </Row>
          <Row className="align-items-center px-3 ">
            <hr className="solid my-0" />
            <h6 className="text-end">Subtotal - Investment</h6>
          </Row>
          <Row className="align-items-center px-3 ">
            U.S. Treasuries
          </Row>
          <Row className="align-items-center px-3 ">
            U.S. Agencies
          </Row>
          <Row className="align-items-center px-3 ">
            <hr className="solid my-0" />
            <h6 className="text-end">Subtotal - Loan Fund</h6>
          </Row>
          <Row className="justify-content-start">
            <h6>Investments</h6>
          </Row>
          <Row className="justify-content-start">
            <h6>Capital Assets, Net:</h6>
          </Row>
          <Row className="align-content-center px-3">
            <h6>Assets</h6>
          </Row>
          <Row className="justify-content-start px-sm-4 ">
            Buildings
          </Row>
          <Row className="align-items-center px-3 ">
            Leasehold Improvements
          </Row>
          <Row className="align-items-center px-3 ">
            Furniture, Fixtures and Equipment
          </Row>
          <Row className="align-items-center px-3 ">
            Less Accumulated Depreciation
          </Row>
          <Row className="align-items-center px-3 ">
            <hr className="solid my-0" />
            <h6 className="text-center">Net</h6>
          </Row>
          <Row className="justify-content-start px-3 ">
            <h6>Land</h6>
          </Row>
          <Row className="align-items-center px-3">
            Land A
          </Row>
          <Row className="align-items-center px-3">
            Land B
          </Row>
          <Row className="align-items-center px-3 ">
            Construction in Progress
          </Row>
          <Row className="align-items-center px-3">
            <hr className="solid my-0" />
            <h6 className="text-end">Subtotal - Capital Assets, Net</h6>
          </Row>
          <Row className="justify-content-start px-3">
            <h6>Limited Liability Company B&apos;s Assets</h6>
          </Row>
          <Row className="align-items-center px-3">
            Buildings
          </Row>
          <Row className="align-items-center px-3">
            Leasehold Improvements
          </Row>
          <Row className="align-items-center px-3">
            Furniture, Fixtures and Equipment
          </Row>
          <Row className="align-items-center px-3">
            Vehicles
          </Row>
          <Row className="align-items-center px-3">
            Less Accumulated Depreciation
          </Row>
          <Row className="align-items-center px-3">
            Land
          </Row>
          <Row className="align-items-center px-3">
            <hr className="solid my-0" />
            <h6 className="text-end">Subtotal - Limited Liability Company B&apos;s Assets</h6>
          </Row>
          <Row className="justify-content-start px-3">
            <h6>Capital Assets, Net</h6>
          </Row>
          <Row className="justify-content-start px-3">
            Restricted Cash
          </Row>
          <Row className="align-items-center px-3">
            <hr className="solid my-0" />
            <h6 className="text-end">Total Other Assets</h6>
          </Row>
          <Row className="justify-content-start px-3">
            Deferred Outflows of Resources Related to Pensions
          </Row>
          <Row className="justify-content-start px-3">
            Deferred Outflows of Resources Related to OPEB
          </Row>
          <Row className="align-items-center px-3">
            <hr className="solid my-0" />
            <h6 className="text-end">Total Assets and Deferred Outflows of Resource</h6>
          </Row>
          <Row className="justify-content-start ">
            <h6>Liabilities</h6>
          </Row>
          <Row className="align-items-center px-3">
            Accounts Payable and Accrued Liabilities
          </Row>
          <Row className="align-items-center px-3">
            Due To Fund
          </Row>
          <Row className="align-items-center px-3">
            Due To Other Fund
          </Row>
          <Row className="justify-content-start px-3">
            <h6>Long-term Liabilities - due within one year:</h6>
          </Row>
          <Row className="align-items-center px-3">
            Accrued vacation
          </Row>
          <Row className="align-items-center px-3">
            Workers&apos; Compensation
          </Row>
          <Row className="align-items-center px-3">
            Accrued Management Retirement Plan
          </Row>
          <Row className="align-items-center px-3">
            Accrued Lease Guaranty Obligation
          </Row>
          <Row className="align-items-center px-3">
            Capital Lease Obligation
          </Row>
          <Row className="align-items-center px-3">
            Notes Payable - Building A Acquisition
          </Row>
          <Row className="align-items-center px-3">
            Net Pension Liability
          </Row>
          <Row className="align-items-center px-3">
            Net OPEB Liability
          </Row>
          <Row className="align-items-center px-3">
            <h6>Line of Credit</h6>
          </Row>
          <Row className="align-items-center px-3">
            Line of Credit - Building A
          </Row>
          <Row className="align-items-center px-3">
            Line of Credit - Building B
          </Row>
          <Row className="align-items-center px-3">
            Debt Service
          </Row>
          <Row className="align-items-center px-3">
            <h6>Long-Term Liabilities - Due Within One Year:</h6>
          </Row>
          <Row className="align-items-center px-3">
            <h6>Long-Term Liabilities - Due After One Year:</h6>
          </Row>
          <Row className="align-items-center px-3">
            Accrued vacation
          </Row>
          <Row className="align-items-center px-3">
            Workers&apos; Compensation
          </Row>
          <Row className="align-items-center px-3">
            Accrued Management Retirement Plan
          </Row>
          <Row className="align-items-center px-3">
            Accrued Lease Guaranty Obligation
          </Row>
          <Row className="align-items-center px-3">
            Capital Lease Obligation
          </Row>
          <Row className="align-items-center px-3">
            Notes Payable - Building A Acquisition
          </Row>
          <Row className="align-items-center px-3">
            Net Pension Liability
          </Row>
          <Row className="align-items-center px-3">
            Net OPEB Liability
          </Row>
          <Row className="align-items-center px-3">
            <h6>Line of Credit</h6>
          </Row>
          <Row className="align-items-center px-3">
            Line of Credit - Building A
          </Row>
          <Row className="align-items-center px-3">
            Line of Credit - Building B
          </Row>
          <Row className="align-items-center px-3">
            Debt Service
          </Row>
          <Row className="align-items-center px-3">
            <h6>Long-Term Liabilities - Due After One Year:</h6>
          </Row>
          <Row className="align-items-center px-3">
            <hr className="solid my-0" />
            <h6 className="text-center">Total Liabilities</h6>
          </Row>
          <Row className="align-items-center px-3">
            Deferred Inflows of Resources Related to Pensions
          </Row>
          <Row className="align-items-center px-3">
            Deferred Inflows of Resources Related to OPEB
          </Row>
          <Row className="align-items-center px-3">
            <hr className="solid my-0" />
            <h6 className="text-end">Total Liabilities and Deferred Inflows of Resources</h6>
          </Row>
          <Row className="justify-content-start ">
            <h6>Commitments and Contingencies</h6>
          </Row>
          <Row className="justify-content-start ">
            <h6>Net Position</h6>
          </Row>
          <Row className="align-items-center px-3">
            Invested in Capital Assets, Net of Related Debt
          </Row>
          <Row className="align-items-center px-3">
            Restricted - Federal Funds
          </Row>
          <Row className="align-items-center px-3">
            Unrestricted
          </Row>
          <Row className="align-items-center px-3">
            <hr className="solid my-0" />
            <h6 className="text-center">Total Net Position</h6>
          </Row>
          <Row className="align-items-center px-3">
            <hr className="solid my-0" />
            <h6 className="text-center">Total Liabilities, Deferred Inflows of Resources</h6>
          </Row>
        </Col>
        {audBalData.map((data) => (
          <Col key={data._id}>
            <DisplayAudBalData audBalData={data} />
          </Col>
        ))}
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Data" />);
};

export default DataInput;
