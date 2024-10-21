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
  const { cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear, pensionRsrcsInflow, OPEBRsrcsInflow, commitConting } = data;
  const docID = audBalData._id;
  const collectionName = AuditedBalanceData.getCollectionName();
  const updateData = { id: docID, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear, pensionRsrcsInflow, OPEBRsrcsInflow, commitConting };
  updateMethod.callPromise({ collectionName, updateData })
    .catch(error => swal('Error', error.message, 'error'))
    .then(() => swal('Success', 'Item updated successfully', 'success'));
};

const DisplayAudBalData = ({ audBalData }) => {
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
  const [totalLiabInflowRsrcs, setTotalLiabInflowRsrcs] = useState(0);
  const [totalCommitConting, setTotalCommitConting] = useState(0);
  const [totalLiabInRsrc, setTotalLiabInRsrc] = useState(0);

  useEffect(() => {
    const cashArray = audBalData.cashStuff || [];
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
    const cashTotal = sumArray(cashArray);
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
    setTotalLiabInflowRsrcs(liabDefInflowRsrcsTotal);
    setTotalCommitConting(commitContingTotal);
    setTotalLiabInRsrc(liabInRsrcTotal);
  }, [audBalData]);
  return (
    <AutoForm schema={bridge} onSubmit={data => submit(audBalData, data)} model={AuditedBalanceData.findOne(audBalData._id)}>
      <Card.Body>
        <Row>
          Year {audBalData.year}
          <hr className="solid" />
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            <NumField name="cashStuff.0.pettyCash" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="cashStuff.0.cash" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="cashStuff.0.cashBankCred" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalCash.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            <NumField name="other.0.actRec" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="other.0.dueFromFund" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center ">
          <Col>
            <NumField name="other.0.intDivRec" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center ">
          <Col>
            <NumField name="other.0.invPrepaid" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center ">
          <Col>
            <NumField name="other.0.notesDueInYr" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center ">
          <Col>
            <NumField name="other.0.notesDueAftYr" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center ">
          <Col>
            <NumField name="other.0.secDep" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="other.0.cashHeldByInvMng" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalOther.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            <NumField name="investments.0.mutFun" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="investments.0.comFun" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="investments.0.hdgFun" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="investments.0.privEqt" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="investments.0.comnTrustFun" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="investments.0.comPrefStock" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="investments.0.privDbt" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="investments.0.other" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalInvestments.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center ">
          <Col>
            <NumField name="loanFund.0.usTreas" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="loanFund.0.usAgenc" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalLoanFund.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="justify-content-start" style={{ paddingTop: '18px' }}>
          <Col>
            <hr className="solid my-0" />
            <h6>$ {totalInvestLoan.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '40px' }}>
          <Col>
            <NumField name="assets.0.bldngs" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="assets.0.leashldImprv" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="assets.0.frnFixEqp" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="assets.0.accumDepr" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalAssets.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            <NumField name="land.0.landA" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="land.0.landB" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center ">
          <Col>
            <NumField name="land.0.cnstrProg" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalLand.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '20px' }}>
          <Col>
            <NumField name="compBAssets.0.bldngs" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="compBAssets.0.leashldImprv" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="compBAssets.0.frnFixEqp" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="compBAssets.0.vehcl" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="compBAssets.0.accumDepr" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="compBAssets.0.land" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalCompBAssets.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="justify-content-start" style={{ paddingTop: '3px' }}>
          <Col>
            <hr className="solid my-0" />
            <h6>$ {totalCapAssets.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="justify-content-start" style={{ paddingTop: '2px' }}>
          <Col>
            <NumField name="rstrCash" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalOtherAssets.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="justify-content-start">
          <Col>
            <NumField name="pensionRsrcs" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="justify-content-start">
          <Col>
            <NumField name="OPEBRsrcs" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalAssetsAndRsrcs.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '18px' }}>
          <Col>
            <NumField name="liabilities.0.acntPayAccLia" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="liabilities.0.dueToFun" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="liabilities.0.dueToOthFun" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '41px' }}>
          <Col>
            <NumField name="longTermInYear.0.accrVac" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermInYear.0.wrkComp" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermInYear.0.acrManRetPln" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermInYear.0.acrLeasGuarOb" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermInYear.0.capLeasOb" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermInYear.0.notPayBuilA" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermInYear.0.netPenLia" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermInYear.0.netOPEBLia" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '41px' }}>
          <Col>
            <NumField name="longTermInYear.0.lineOfCredA" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermInYear.0.lineOfCredB" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermInYear.0.debtServ" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalLongTermInYear.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '18px' }}>
          <Col>
            <NumField name="longTermAftYear.0.accrVac" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermAftYear.0.wrkComp" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermAftYear.0.acrManRetPln" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermAftYear.0.acrLeasGuarOb" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermAftYear.0.capLeasOb" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermAftYear.0.notPayBuilA" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermAftYear.0.netPenLia" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermAftYear.0.netOPEBLia" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '40px' }}>
          <Col>
            <NumField name="longTermAftYear.0.lineOfCredA" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermAftYear.0.lineOfCredB" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="longTermAftYear.0.debtServ" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <h6>$ {totalLongTermAftYear.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <hr className="solid my-0" />
            <h6>$ {totalLiabilities.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="pensionRsrcsInflow" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="OPEBRsrcsInflow" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <hr className="solid my-0" />
            <h6>$ {totalLiabInflowRsrcs.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '44px' }}>
          <Col>
            <NumField name="commitConting.0.invCapAssNetDbt" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="commitConting.0.rstrFedFun" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <NumField name="commitConting.0.unRstr" style={{ height: '25px' }} decimal label={null} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <hr className="solid my-0" />
            <h6>$ {totalCommitConting.toFixed(2)}</h6>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ paddingTop: '1px' }}>
          <Col>
            <hr className="solid my-0" />
            <h6>$ {totalLiabInRsrc.toFixed(2)}</h6>
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
DisplayAudBalData.propTypes = {
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
  }).isRequired,
};

export default DisplayAudBalData;
