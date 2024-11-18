import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Row, Container, Card } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import LoadingSpinner from '../components/LoadingSpinner';
import FileInput from '../components/FileInput';
import { PAGE_IDS } from '../utilities/PageIDs';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { AutoForm, ErrorsField, HiddenField, NumField, SubmitField } from 'uniforms-bootstrap5';
import PropTypes from 'prop-types';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ClientDataImport = () => {
  const [importedData, setImportedData] = useState(null);
  const bridge = new SimpleSchema2Bridge(AuditedBalanceData._schema);
  const submit = (audBalData, formRef) => {
    const { cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear, pensionRsrcsInflow, OPEBRsrcsInflow, commitConting } = data;
    const owner = Meteor.user().username;
    // const docID = audBalData._id;
    const collectionName = AuditedBalanceData.getCollectionName();
    const definitionData = { owner, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear, pensionRsrcsInflow, OPEBRsrcsInflow, commitConting };
    defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        });
  };

  const handleDataLoad = (data) => {
    setImportedData(data);
    // console.log('Imported Data:', data);
  };

  // Transform into the expected structure
  const parsedData = {
    year: importedData.Year,

    cashStuff: [{
      pettyCash: importedData['Petty cash'],
      cash: importedData.Cash,
      cashBankCred: importedData['Cash in banks'],
    }],

    cashTotal: importedData['Petty cash'] +
        importedData.Cash +
        importedData['Cash in banks'],

    other: [{
      actRec: importedData['Accounts receivable'],
      dueFromFund: importedData['Due from other fund'],
      intDivRec: importedData['Interest and dividends receivable'],
      invPrepaid: importedData['Inventory, prepaid items and other assets'],
      notesDueInYr: importedData['Notes receivable - due within one year'],
      notesDueAftYr: importedData['Notes receivable - due after one year'],
      secDep: importedData['Security Deposits'],
      cashHeldByInvMng: importedData['Cash held by investment manager'],
    }],

    otherTotal: importedData['Accounts receivable'] +
        importedData['Due from other fund'] +
        importedData['Interest and dividends receivable'] +
        importedData['Inventory, prepaid items and other assets'] +
        importedData['Notes receivable - due within one year'] +
        importedData['Notes receivable - due after one year'] +
        importedData['Security Deposits'] +
        importedData['Cash held by investment manager'],

    investments: [{
      mutFun: importedData.Investments,
      comFun: importedData['Restricted - federal funds'],
      hdgFun: 0,
      privEqt: importedData.Unrestricted,
      comnTrustFun: 0,
      comPrefStock: 0,
      privDbt: 0,
      other: 0,
    }],

    investmentsTotal: importedData.Investments +
        importedData['Restricted - federal funds'] +
        importedData.Unrestricted,

    loanFund: [{
      usTreas: 0,
      usAgenc: 0,
    }],

    loanFundTotal: 0,

    assets: [{
      bldngs: 0,
      leashldImprv: 0,
      frnFixEqp: 0,
      accumDepr: 0,
    }],

    assetsTotal: importedData['Capital assets - net'],

    land: [{
      landA: 0,
      landB: 0,
      cnstrProg: 0,
    }],

    landTotal: 0,

    compBAssets: [{
      bldngs: 0,
      leashldImprv: 0,
      frnFixEqp: 0,
      vehcl: 0,
      accumDepr: 0,
      land: 0,
    }],

    compBAssetsTotal: 0,

    capAssetsTotal: importedData['Capital assets - net'],
    rstrCash: importedData['Restricted cash'],
    pensionRsrcs: importedData['Deferred outflows of resources'],
    OPEBRsrcs: 0,

    liabilities: [{
      acntPayAccLia: importedData['Accounts payable and accrued liabilities'],
      dueToFun: importedData['Due to fund'],
      dueToOthFun: importedData['Due to other fund'],
    }],

    liabilitiesTotal: importedData['Accounts payable and accrued liabilities'] +
        importedData['Due to fund'] +
        importedData['Due to other fund'],

    longTermInYear: [{
      accrVac: 0,
      wrkComp: 0,
      acrManRetPln: 0,
      acrLeasGuarOb: 0,
      capLeasOb: 0,
      notPayBuilA: 0,
      netPenLia: 0,
      netOPEBLia: 0,
      lineOfCredA: 0,
      lineOfCredB: 0,
      debtServ: importedData['Long-term liabilities - due within one year'],
    }],

    longTermInYearTotal: importedData['Long-term liabilities - due within one year'],

    longTermAftYear: [{
      accrVac: 0,
      wrkComp: 0,
      acrManRetPln: 0,
      acrLeasGuarOb: 0,
      capLeasOb: 0,
      notPayBuilA: 0,
      netPenLia: importedData['Long-term liabilities - due after one year'],
      netOPEBLia: 0,
      lineOfCredA: 0,
      lineOfCredB: 0,
      debtServ: 0,
    }],

    longTermAftYearTotal: importedData['Long-term liabilities - due after one year'],

    allLiabilitiesTotal: importedData['Accounts payable and accrued liabilities'] +
        importedData['Due to fund'] +
        importedData['Due to other fund'] +
        importedData['Long-term liabilities - due within one year'] +
        importedData['Long-term liabilities - due after one year'],

    pensionRsrcsInflow: importedData['Deferred inflows of resources'],
    OPEBRsrcsInflow: importedData['Deferred inflows of OPEB'],

    liabInflowRsrcsTotal: importedData['Deferred inflows of resources'] +
        importedData['Deferred inflows of OPEB'],

    commitConting: [{
      invCapAssNetDbt: importedData['Invested in capital assets, net of related debt'],
      rstrFedFun: importedData['Restricted - federal funds'],
      unRstr: importedData.Unrestricted,
    }],

    totalNet: importedData['Invested in capital assets, net of related debt'] +
        importedData['Restricted - federal funds'] +
        importedData.Unrestricted,

    totalLiabInRsrc: 0,

  };

  return (ready ? (
    <Container id={PAGE_IDS.CLIENT_DATA_IMPORT} className="py-3">
      <Row className="justify-content-center">
        <Col lg={12}>
          <Col className="text-center">
            <h1>Client Data</h1>
          </Col>
          <FileInput onDataLoad={handleDataLoad} />
          { importedData }
        </Col>
        <Col><h2>Audited Balance Sheet</h2></Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Stuff" />);
};

export default ClientDataImport;
