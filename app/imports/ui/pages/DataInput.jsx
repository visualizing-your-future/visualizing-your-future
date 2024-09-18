import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SubmitField, NumField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
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
  const [totalLongTermInYear, setTotalLongTermInYear] = useState(0);
  const [totalLongTermAftYear, setTotalLongTermAftYear] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const { audBalData, ready } = useTracker(() => {
    const subscription = AuditedBalanceData.subscribeAudBalData();
    const rdy = subscription.ready();
    const data = AuditedBalanceData.find({}, { sort: { name: 1 } }).fetch();
    return {
      audBalData: data,
      ready: rdy,
    };
  }, []);

  useEffect(() => {
    if (ready) {
      const cashArray = audBalData[0].cashStuff;
      const otherArray = audBalData[0].other || [];
      const investmentsArray = audBalData[0].investments || [];
      const loanFundArray = audBalData[0].loanFund || [];
      const assetsArray = audBalData[0].assets || [];
      const landArray = audBalData[0].land || [];
      const compBAssetsArray = audBalData[0].compBAssets || [];
      const rstrCash = audBalData[0].rstrCash || 0;
      const pensionRsrcs = audBalData[0].pensionRsrcs || 0;
      const OPEBRsrcs = audBalData[0].OPEBRsrcs || 0;
      const liabArray = audBalData[0].liabilities || [];
      const longTermInYearArray = audBalData[0].longTermInYear || [];
      const longTermAftYearArray = audBalData[0].longTermAftYear || [];
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
      const longTermInYearTotal = longTermInYearArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
      const longTermAftYearTotal = longTermAftYearArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
      const liabilitiesTotal = longTermInYearTotal + longTermAftYearTotal + liabArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);

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
      setTotalLongTermInYear(longTermInYearTotal);
      setTotalLongTermAftYear(longTermAftYearTotal);
      setTotalLiabilities(liabilitiesTotal);
    }
  }, [ready, audBalData]);

  const submit = (data) => {
    const { cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear, pensionRsrcsInflow, OPEBRsrcsInflow, commitConting } = data;
    const docID = audBalData[0]._id;
    const collectionName = AuditedBalanceData.getCollectionName();
    console.log(longTermInYear);
    const updateData = { id: docID, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear, pensionRsrcsInflow, OPEBRsrcsInflow, commitConting };
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
      <AutoForm schema={bridge} onSubmit={data => submit(data)} model={AuditedBalanceData.findOne(audBalData._id)}>
        <Card.Body className="m-0">
          <Row className="justify-content-start">
            <Col className="col-lg-3">
              <h6>Cash and Cash Equivalents</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              Petty Cash
            </Col>
            <Col className="col-lg-2">
              <NumField name="cashStuff.0.pettyCash" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              Cash
            </Col>
            <Col className="col-lg-2">
              <NumField name="cashStuff.0.cash" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              Cash in banks/Draw on Line of Credit
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
              Accounts Receivable
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.actRec" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              Due from other fund
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.dueFromFund" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              Interest and dividends receivable
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.intDivRec" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              Inventory, prepaid items and other assets
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.invPrepaid" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              Notes receivable - due within one year
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.notesDueInYr" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              Notes receivable - due after one year
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.notesDueAftYr" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              Security Deposits
            </Col>
            <Col className="col-lg-2">
              <NumField name="other.0.secDep" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              Cash held by investment manager
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
              Mutual Funds
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.mutFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Commingled Funds
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.comFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Hedge Funds
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.hdgFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Private Equity
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.privEqt" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Common Trust Fund
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.comnTrustFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Common & Preferred Stock
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.comPrefStock" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Private Debt
            </Col>
            <Col className="col-lg-2">
              <NumField name="investments.0.privDbt" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Other
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
              U.S. Treasuries
            </Col>
            <Col className="col-lg-2">
              <NumField name="loanFund.0.usTreas" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              U.S. Agencies
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
              Buildings
            </Col>
            <Col className="col-lg-2">
              <NumField name="assets.0.bldngs" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Leasehold Improvements
            </Col>
            <Col className="col-lg-2">
              <NumField name="assets.0.leashldImprv" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Furniture, Fixtures and Equipment
            </Col>
            <Col className="col-lg-2">
              <NumField name="assets.0.frnFixEqp" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Less Accumulated Depreciation
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
            <Col className="col-lg-3 ps-5">
              Land A
            </Col>
            <Col className="col-lg-2">
              <NumField name="land.0.landA" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Land B
            </Col>
            <Col className="col-lg-2">
              <NumField name="land.0.landB" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3 mb-0">
            <Col className="col-lg-3">
              Construction in Progress
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
              Buildings
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.bldngs" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Leasehold Improvements
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.leashldImprv" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Furniture, Fixtures and Equipment
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.frnFixEqp" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Vehicles
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.vehcl" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Less Accumulated Depreciation
            </Col>
            <Col className="col-lg-2">
              <NumField name="compBAssets.0.accumDepr" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Land
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
              Restricted Cash
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
              Deferred Outflows of Resources Related to Pensions
            </Col>
            <Col className="col-lg-2">
              <NumField name="pensionRsrcs" decimal label={null} />
            </Col>
          </Row>
          <Row className="justify-content-start px-3">
            <Col className="col-lg-3">
              Deferred Outflows of Resources Related to OPEB
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
          </Row>
          <Row className="justify-content-start pt-3">
            <Col className="col-lg-3">
              <h6>Liabilities</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              Accounts Payable and Accrued Liabilities
            </Col>
            <Col className="col-lg-2">
              <NumField name="liabilities.0.acntPayAccLia" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              Due To Fund
            </Col>
            <Col className="col-lg-2">
              <NumField name="liabilities.0.dueToFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              Due To Other Fund
            </Col>
            <Col className="col-lg-2">
              <NumField name="liabilities.0.dueToOthFun" decimal label={null} />
            </Col>
          </Row>
          <Row className="justify-content-start px-3">
            <Col className="col-lg-3">
              <h6>Long-term Liabilities - due within one year:</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Accrued vacation
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.accrVac" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Workers&apos; Compensation
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.wrkComp" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Accrued Management Retirement Plan
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.acrManRetPln" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Accrued Lease Guaranty Obligation
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.acrLeasGuarOb" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Capital Lease Obligation
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.capLeasOb" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Notes Payable - Building A Acquisition
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.notPayBuilA" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Net Pension Liability
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.netPenLia" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Net OPEB Liability
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.netOPEBLia" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h6>Line of Credit</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="text-center col-lg-3 ps-5">
              Line of Credit - Building A
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.lineOfCredA" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="text-center col-lg-3 ps-5">
              Line of Credit - Building B
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.lineOfCredB" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Debt Service
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermInYear.0.debtServ" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-3">
              <h6>Long-Term Liabilities - Due Within One Year:</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalLongTermInYear}</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-3">
              <h6>Long-Term Liabilities - Due After One Year:</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Accrued vacation
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.accrVac" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Workers&apos; Compensation
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.wrkComp" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Accrued Management Retirement Plan
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.acrManRetPln" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Accrued Lease Guaranty Obligation
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.acrLeasGuarOb" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Capital Lease Obligation
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.capLeasOb" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Notes Payable - Building A Acquisition
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.notPayBuilA" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Net Pension Liability
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.netPenLia" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Net OPEB Liability
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.netOPEBLia" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              <h6>Line of Credit</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="text-center col-lg-3 ps-5">
              Line of Credit - Building A
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.lineOfCredA" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="text-center col-lg-3 ps-5">
              Line of Credit - Building B
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.lineOfCredB" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-5">
              Debt Service
            </Col>
            <Col className="col-lg-2">
              <NumField name="longTermAftYear.0.debtServ" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3 ps-3">
              <h6>Long-Term Liabilities - Due After One Year:</h6>
            </Col>
            <Col className="col-lg-2">
              <h6>$ {totalLongTermAftYear}</h6>
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="col-lg-3">
              <hr className="solid my-0" />
              <h6 className="text-center">Total Liabilities</h6>
            </Col>
            <Col className="col-lg-2">
              <hr className="solid my-0" />
              <h6>$ {totalLiabilities}</h6>
            </Col>
            <Col className="col-lg-2">
              <SubmitField value="Update" />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="text-center col-lg-3 ps-5">
              Deferred Inflows of Resources Related to Pensions
            </Col>
            <Col className="col-lg-2">
              <NumField name="pensionRsrcsInflow" decimal label={null} />
            </Col>
          </Row>
          <Row className="align-items-center px-3">
            <Col className="text-center col-lg-3 ps-5">
              Deferred Inflows of Resources Related to OPEB
            </Col>
            <Col className="col-lg-2">
              <NumField name="OPEBRsrcsInflow" decimal label={null} />
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
