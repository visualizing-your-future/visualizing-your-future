import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, NumField, SubmitField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(AuditedBalanceData._schema);

const sumArray = (array) => array.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);

const submit = (audBalData, data) => {
  const { cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear, pensionRsrcsInflow,
    OPEBRsrcsInflow, commitConting, revenue, expenses, salary, management, supServ, benAdv } = data;
  const docID = audBalData._id;
  const collectionName = AuditedBalanceData.getCollectionName();
  const updateData = { id: docID, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear,
    longTermAftYear, pensionRsrcsInflow, OPEBRsrcsInflow, commitConting, revenue, expenses, salary, management, supServ, benAdv };
  updateMethod.callPromise({ collectionName, updateData })
    .catch(error => swal('Error', error.message, 'error'))
    .then(() => swal('Success', 'Item updated successfully', 'success'));
};

const DisplayBudgetPLData = ({ audBalData }) => {
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
  const [totalLiabInflowRsrcs, setTotalLiabInflowRsrcs] = useState(0);
  const [totalCommitConting, setTotalCommitConting] = useState(0);
  const [totalLiabInRsrc, setTotalLiabInRsrc] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const otherArray = audBalData.other || [];
    const investmentsArray = audBalData.investments || [];
    const loanFundArray = audBalData.loanFund || [];
    const assetsArray = audBalData.assets || [];
    const landArray = audBalData.land || [];
    const compBAssetsArray = audBalData.compBAssets || [];
    const rstrCash = audBalData.rstrCash || 0;
    const pensionRsrcs = audBalData.pensionRsrcs || 0;
    const OPEBRsrcs = audBalData.OPEBRsrcs || 0;
    const liabArray = audBalData.liabilities || [];
    const longTermInYearArray = audBalData.longTermInYear || [];
    const longTermAftYearArray = audBalData.longTermAftYear || [];
    const pensionRsrcsInflow = audBalData.pensionRsrcsInflow || 0;
    const OPEBRsrcsInflow = audBalData.OPEBRsrcsInflow || 0;
    const commitContingArray = audBalData.commitConting || [];
    const revenueArray = audBalData.revenue || [];
    const expensesArray = audBalData.expenses || [];
    const otherTotal = sumArray(otherArray);
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
    const liabDefInflowRsrcsTotal = liabilitiesTotal + pensionRsrcsInflow + OPEBRsrcsInflow;
    const commitContingTotal = commitContingArray.reduce((sum, item) => sum + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
    const liabInRsrcTotal = liabDefInflowRsrcsTotal + commitContingTotal;
    const revenueTotal = sumArray(revenueArray);
    const expensesTotal = sumArray(expensesArray);

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
    setTotalLiabInflowRsrcs(liabDefInflowRsrcsTotal);
    setTotalCommitConting(commitContingTotal);
    setTotalLiabInRsrc(liabInRsrcTotal);
    setTotalRevenue(revenueTotal);
    setTotalExpenses(expensesTotal);
  }, [audBalData]);
  return (
    <AutoForm schema={bridge} onSubmit={data => submit(audBalData, data)} model={AuditedBalanceData.findOne(audBalData._id)}>
      <Card.Body>
        <Row>
          {audBalData.year}
          <hr className="solid" />
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            <NumField name="revenue.0.investPort" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="revenue.0.revs" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="revenue.0.genFund" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="revenue.0.coreOpBudget" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalRevenue.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            <NumField name="expenses.0.personnel" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '20px' }}>
          <Col>
            Salary Temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '30px' }}>
          <Col>
            Pension Accum Temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Retiree Health Insur Temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Other post emp temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Employees health fund temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Social Security temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            medicare temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            workers comp temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            unemp workers comp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            pension admin temp
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            Fringe Benefits temp
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            Personnel Fringe admin Temp
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            Personnel Fringe admin staff Temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '15px' }}>
          <Col>
            Salary Temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '20px' }}>
          <Col>
            Pension Accum Temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Retiree Health Insur Temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Other post emp temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Employees health fund temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Social Security temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            medicare temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            workers comp temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            unemp workers comp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            pension admin temp
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            Fringe Benefits temp
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            Personnel Fringe management staff Temp
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            Personnel Fringe management Temp
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="salary" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '20px' }}>
          <Col>
            Pension Accum Temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Retiree Health Insur Temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Other post emp temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Employees health fund temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            Social Security temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            medicare temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            workers comp temp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            unemp workers comp
          </Col>
        </Row>
        <Row className="text-start" style={{ paddingTop: '3px' }}>
          <Col>
            pension admin temp
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            Fringe Benefits temp
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            Personnel Fringe management Temp
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            <NumField name="expenses.0.program" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="expenses.0.contracts" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="expenses.0.grants" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="expenses.0.travel" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="expenses.0.equip" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="expenses.0.overhead" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="expenses.0.deptServ" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="expenses.0.other" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalExpenses.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '5px' }}>
          <Col>
            Surplus temp
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '30px' }}>
          <Col>
            <NumField name="management" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="supServ" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="benAdv" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Col>
          <SubmitField value="Update" />
        </Col>
        <ErrorsField />
        <HiddenField name="owner" />
      </Card.Body>
    </AutoForm>
  );
};

// Require a document to be passed to this component.
DisplayBudgetPLData.propTypes = {
  audBalData: PropTypes.shape({
    owner: PropTypes.string,
    year: PropTypes.number,
    cashStuff: PropTypes.arrayOf(PropTypes.shape({
      pettyCash: PropTypes.number,
      cash: PropTypes.number,
      cashBankCred: PropTypes.number,
    })),
    cashTotal: PropTypes.number,
    other: PropTypes.arrayOf(PropTypes.shape({
      actRec: PropTypes.number,
      dueFromFund: PropTypes.number,
      intDivRec: PropTypes.number,
      invPrepaid: PropTypes.number,
      notesDueInYr: PropTypes.number,
      notesDueAftYr: PropTypes.number,
      secDep: PropTypes.number,
      cashHeldByInvMng: PropTypes.number,
    })),
    otherTotal: PropTypes.number,
    investments: PropTypes.arrayOf(PropTypes.shape({
      mutFun: PropTypes.number,
      comFun: PropTypes.number,
      hdgFun: PropTypes.number,
      privEqt: PropTypes.number,
      comnTrustFun: PropTypes.number,
      comPrefStock: PropTypes.number,
      privDbt: PropTypes.number,
      other: PropTypes.number,
    })),
    investmentsTotal: PropTypes.number,
    loanFund: PropTypes.arrayOf(PropTypes.shape({
      usTreas: PropTypes.number,
      usAgenc: PropTypes.number,
    })),
    loanFundTotal: PropTypes.number,
    investLoanTotal: PropTypes.number,
    assets: PropTypes.arrayOf(PropTypes.shape({
      bldngs: PropTypes.number,
      leashldImprv: PropTypes.number,
      frnFixEqp: PropTypes.number,
      accumDepr: PropTypes.number,
    })),
    assetsTotal: PropTypes.number,
    land: PropTypes.arrayOf(PropTypes.shape({
      landA: PropTypes.number,
      landB: PropTypes.number,
      cnstrProg: PropTypes.number,
    })),
    landTotal: PropTypes.number,
    compBAssets: PropTypes.arrayOf(PropTypes.shape({
      bldngs: PropTypes.number,
      leashldImprv: PropTypes.number,
      frnFixEqp: PropTypes.number,
      vehcl: PropTypes.number,
      accumDepr: PropTypes.number,
      land: PropTypes.number,
    })),
    compBAssetsTotal: PropTypes.number,
    capAssetsTotal: PropTypes.number,
    rstrCash: PropTypes.number,
    otherAssetsTotal: PropTypes.number,
    pensionRsrcs: PropTypes.number,
    OPEBRsrcs: PropTypes.number,
    totAssetsAndRsrcs: PropTypes.number,
    liabilities: PropTypes.arrayOf(PropTypes.shape({
      acntPayAccLia: PropTypes.number,
      dueToFun: PropTypes.number,
      dueToOthFun: PropTypes.number,
    })),
    liabilitiesTotal: PropTypes.number,
    longTermInYear: PropTypes.arrayOf(PropTypes.shape({
      accrVac: PropTypes.number,
      wrkComp: PropTypes.number,
      acrManRetPln: PropTypes.number,
      acrLeasGuarOb: PropTypes.number,
      capLeasOb: PropTypes.number,
      notPayBuilA: PropTypes.number,
      netPenLia: PropTypes.number,
      netOPEBLia: PropTypes.number,
      lineOfCredA: PropTypes.number,
      lineOfCredB: PropTypes.number,
      debtServ: PropTypes.number,
    })),
    longTermInYearTotal: PropTypes.number,
    longTermAftYear: PropTypes.arrayOf(PropTypes.shape({
      accrVac: PropTypes.number,
      wrkComp: PropTypes.number,
      acrManRetPln: PropTypes.number,
      acrLeasGuarOb: PropTypes.number,
      capLeasOb: PropTypes.number,
      notPayBuilA: PropTypes.number,
      netPenLia: PropTypes.number,
      netOPEBLia: PropTypes.number,
      lineOfCredA: PropTypes.number,
      lineOfCredB: PropTypes.number,
      debtServ: PropTypes.number,
    })),
    longTermAftYearTotal: PropTypes.number,
    allLiabilitiesTotal: PropTypes.number,
    pensionRsrcsInflow: PropTypes.number,
    OPEBRsrcsInflow: PropTypes.number,
    liabInflowRsrcsTotal: PropTypes.number,
    commitConting: PropTypes.arrayOf(PropTypes.shape({
      invCapAssNetDbt: PropTypes.number,
      rstrFedFun: PropTypes.number,
      unRstr: PropTypes.number,
    })),
    totalNet: PropTypes.number,
    totalLiabInRsrc: PropTypes.number,
    _id: PropTypes.string,
    revenue: PropTypes.arrayOf(PropTypes.shape({
      investPort: PropTypes.number,
      revs: PropTypes.number,
      genFund: PropTypes.number,
      coreOpBudget: PropTypes.number,
    })),
    expenses: PropTypes.arrayOf(PropTypes.shape({
      personnel: PropTypes.number,
      program: PropTypes.number,
      contracts: PropTypes.number,
      grants: PropTypes.number,
      travel: PropTypes.number,
      equip: PropTypes.number,
      overhead: PropTypes.number,
      deptServ: PropTypes.number,
      other: PropTypes.number,
    })),
  }).isRequired,
};

export default DisplayBudgetPLData;
