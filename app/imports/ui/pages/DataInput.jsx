import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SubmitField, NumField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
// import { useParams } from 'react-router';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(AuditedBalanceData._schema);

const DataInput = () => {
  const [totalCash, setTotalCash] = useState(0);
  const [totalOther, setTotalOther] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [totalLoanFund, setTotalLoanFund] = useState(0);
  const [totalInvestLoan, setTotalInvestLoan] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLand, setTotalLand] = useState(0);
  const [totalCompBAssets, setTotalCompBAssets] = useState(0);
  const [totalCapAssets, setTotalCapAssets] = useState(0);
  const [totalOtherAssets, setTotalOtherAssets] = useState(0);
  const [totalAssetsAndRsrcs, setTotalAssetsAndRsrcs] = useState(0);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { dataStuff, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = AuditedBalanceData.subscribeABD();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const data = AuditedBalanceData.find({}, { sort: { name: 1 } }).fetch();
    return {
      dataStuff: data,
      ready: rdy,
    };
  }, []);

  useEffect(() => {
    if (ready) {
      const cashArray = dataStuff[0].cashStuff;
      const otherArray = dataStuff[0].other || [];
      const investmentsArray = dataStuff[0].investments || [];
      const loanFundArray = dataStuff[0].loanFund || [];
      const assetsArray = dataStuff[0].assets || [];
      const landArray = dataStuff[0].land || [];
      const compBAssetsArray = dataStuff[0].compBAssets || [];
      const rstrCash = dataStuff[0].rstrCash || 0;
      const pensionRsrcs = dataStuff[0].pensionRsrcs || 0;
      const OPEBRsrcs = dataStuff[0].OPEBRsrcs || 0;

      const cashTotal = cashArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
      const otherTotal = otherArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
      const investmentsTotal = investmentsArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
      const loanFundTotal = loanFundArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
      const investLoanTotal = investmentsTotal + loanFundTotal;
      const assetsTotal = assetsArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
      const landTotal = landArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
      const compBAssetsTotal = compBAssetsArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
      const capAssetsTotal = assetsTotal + landTotal + compBAssetsTotal;
      const otherAssetsTotal = rstrCash + capAssetsTotal + investLoanTotal + otherTotal;
      const assetsAndRsrcsTotal = pensionRsrcs + OPEBRsrcs + otherAssetsTotal;

      setTotalCash(cashTotal);
      setTotalOther(otherTotal);
      setTotalInvestments(investmentsTotal);
      setTotalLoanFund(loanFundTotal);
      setTotalInvestLoan(investLoanTotal);
      setTotalAssets(assetsTotal);
      setTotalLand(landTotal);
      setTotalCompBAssets(compBAssetsTotal);
      setTotalCapAssets(capAssetsTotal);
      setTotalOtherAssets(otherAssetsTotal);
      setTotalAssetsAndRsrcs(assetsAndRsrcsTotal);
    }
  }, [ready, dataStuff]);

  // On successful submit, insert the data.
  const submit = (data) => {
    const { cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs } = data;
    const docID = dataStuff[0]._id;
    const collectionName = AuditedBalanceData.getCollectionName();
    const updateData = { id: docID, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  };

  return (ready ? (
    <Container id={PAGE_IDS.DATA_STUFF} className="py-3">
      <Row className="justify-content-center pb-3">
        <Col md={7}>
          <Col className="text-center">
            <h2>Audited Balance Sheet Temp</h2>
          </Col>
        </Col>
      </Row>
      <Row>
        <Col className="col-lg-3">
          <h6>Fiscal Year</h6>
        </Col>
        <Col className="col-lg-9">
          <Row className="justify-content-start">
            <Col className="col-lg-2">Year XX</Col>
          </Row>
        </Col>
        <hr className="solid" />
      </Row>
      <AutoForm schema={bridge} onSubmit={data => submit(data)} model={AuditedBalanceData.findOne(dataStuff._id)}>
        <Card.Body className="m-0">
          <Row className="justify-content-start">
            <Col className="col-lg-3">
              <h6>Cash and Cash Equivalents</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <h7>Petty Cash</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="cashStuff.0.pettyCash" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <h7>Cash</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="cashStuff.0.cash" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <h7>Cash in banks/Draw on Line of Credit</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="cashStuff.0.cashBankCred" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <hr className="solid my-0" />
              <h6 className="text-end">Total Cash and Cash Equivalents</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalCash}</h6>
            </Col>
          </Row>
          <Row className="justify-content-start my-0">
            <Col className="col-lg-3">
              <h6>Other Assets</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <h7>Accounts Receivable</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.actRec" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <h7>Due from other fund</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.dueFromFund" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              <h7>Interest and dividends receivable</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.intDivRec" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              <h7>Inventory, prepaid items and other assets</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.invPrepaid" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              <h7>Notes receivable - due within one year</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.notesDueInYr" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              <h7>Notes receivable - due after one year</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.notesDueAftYr" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              <h7>Security Deposits</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.secDep" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <h7>Cash held by investment manager</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.cashHeldByInvMng" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <hr className="solid my-0" />
              <h6 className="text-end">Total Other</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalOther}</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <h6>Investments:</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Mutual Funds</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.mutFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Commingled Funds</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.comFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Hedge Funds</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.hdgFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Private Equity</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.privEqt" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Common Trust Fund</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.comnTrustFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Common & Preferred Stock</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.comPrefStock" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Private Debt</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.privDbt" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Other</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.other" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <hr className="solid my-0" />
              <h6 className="text-end">Subtotal - Investment</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalInvestments}</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>U.S. Treasuries</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="loanFund.0.usTreas" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>U.S. Agencies</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="loanFund.0.usAgenc" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <hr className="solid my-0" />
              <h6 className="text-end">Subtotal - Loan Fund</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalLoanFund}</h6>
            </Col>
          </Row>
          <Row className="justify-content-start px-3">
            <Col className="col-lg-3">
              <h6>Investments</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalInvestLoan}</h6>
            </Col>
          </Row>
          <Row className="justify-content-start px-3">
            <Col className="col-lg-3">
              <h6>Capital Assets, Net:</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h6>Assets</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Buildings</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="assets.0.bldngs" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Leasehold Improvements</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="assets.0.leashldImprv" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Furniture, Fixtures and Equipment</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="assets.0.frnFixEqp" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Less Accumulated Depreciation</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="assets.0.accumDepr" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <hr className="solid my-0" />
              <h6 className="text-center">Net</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalAssets}</h6>
            </Col>
          </Row>
          <Row className="justify-content-start ps-3">
            <Col className="col-lg-3">
              <h6>Land</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <h7 className="ps-5">Land A</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="land.0.landA" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <h7 className="ps-5">Land B</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="land.0.landB" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              <h7>Construction in Progress</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="land.0.cnstrProg" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <hr className="solid my-0" />
              <h6 className="text-end">Subtotal - Capital Assets, Net</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalLand}</h6>
            </Col>
          </Row>
          <Row className="justify-content-start px-3">
            <Col className="col-lg-3">
              <h6>Limited Liability Company B&apos;s Assets</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Buildings</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.bldngs" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Leasehold Improvements</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.leashldImprv" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Furniture, Fixtures and Equipment</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.frnFixEqp" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Vehicles</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.vehcl" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Less Accumulated Depreciation</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.accumDepr" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h7>Land</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.land" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <hr className="solid my-0" />
              <h6 className="text-end">Subtotal - Limited Liability Company B&apos;s Assets</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalCompBAssets}</h6>
            </Col>
          </Row>
          <Row className="justify-content-start px-3">
            <Col className="col-lg-3">
              <h6>Capital Assets, Net</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalCapAssets}</h6>
            </Col>
          </Row>
          <Row className="justify-content-start px-3">
            <Col className="col-lg-3">
              <h7>Restricted Cash</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="rstrCash" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <hr className="solid my-0" />
              <h6 className="text-end">Total Other Assets</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalOtherAssets}</h6>
            </Col>
          </Row>
          <Row className="justify-content-start px-3">
            <Col className="col-lg-3">
              <h7>Deferred Outflows of Resources Related to Pensions</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="pensionRsrcs" decimal label={null} />
            </Col>
          </Row>
          <Row className="justify-content-start px-3">
            <Col className="col-lg-3">
              <h7>Deferred Outflows of Resources Related to OPEB</h7>
            </Col>
            <Col className="col-lg-2">
              <NumField name="OPEBRsrcs" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <hr className="solid my-0" />
              <h6 className="text-end">Total Assets and Deferred Outflows of Resource</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalAssetsAndRsrcs}</h6>
            </Col>
            <Col className="col-lg-2">
              <SubmitField value="Update" />
            </Col>
          </Row>
          <ErrorsField />
          <HiddenField name="owner" />
        </Card.Body>
      </AutoForm>
    </Container>
  ) : <LoadingSpinner message="Loading Data" />);
};

export default DataInput;
