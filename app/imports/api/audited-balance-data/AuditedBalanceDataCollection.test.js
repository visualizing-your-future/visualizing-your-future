import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { AuditedBalanceData } from './AuditedBalanceDataCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { MATPCollections } from '../matp/MATPCollections';
import { testDefine, testDumpRestore, testDataUpdate } from '../utilities/test-helpers';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

const collectionName = AuditedBalanceData.getCollectionName();

if (Meteor.isServer) {
  describe(collectionName, function testSuite() {
    const collection = MATPCollections.getCollection(collectionName);

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 1 }),
          fc.integer({ min: 0, max: 10 }),
          fc.array(fc.record({
            pettyCash: fc.integer({ min: 0, max: 1000 }),
            cash: fc.integer({ min: 0, max: 1000 }),
            cashBankCred: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            actRec: fc.integer({ min: 0, max: 1000 }),
            dueFromFund: fc.integer({ min: 0, max: 1000 }),
            intDivRec: fc.integer({ min: 0, max: 1000 }),
            invPrepaid: fc.integer({ min: 0, max: 1000 }),
            notesDueInYr: fc.integer({ min: 0, max: 1000 }),
            notesDueAftYr: fc.integer({ min: 0, max: 1000 }),
            secDep: fc.integer({ min: 0, max: 1000 }),
            cashHeldByInvMng: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            mutFun: fc.integer({ min: 0, max: 1000 }),
            comFun: fc.integer({ min: 0, max: 1000 }),
            hdgFun: fc.integer({ min: 0, max: 1000 }),
            privEqt: fc.integer({ min: 0, max: 1000 }),
            comnTrustFun: fc.integer({ min: 0, max: 1000 }),
            comPrefStock: fc.integer({ min: 0, max: 1000 }),
            privDbt: fc.integer({ min: 0, max: 1000 }),
            other: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            usTreas: fc.integer({ min: 0, max: 1000 }),
            usAgenc: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            bldngs: fc.integer({ min: 0, max: 1000 }),
            leashldImprv: fc.integer({ min: 0, max: 1000 }),
            frnFixEqp: fc.integer({ min: 0, max: 1000 }),
            accumDepr: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            landA: fc.integer({ min: 0, max: 1000 }),
            landB: fc.integer({ min: 0, max: 1000 }),
            cnstrProg: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            bldngs: fc.integer({ min: 0, max: 1000 }),
            leashldImprv: fc.integer({ min: 0, max: 1000 }),
            frnFixEqp: fc.integer({ min: 0, max: 1000 }),
            vehcl: fc.integer({ min: 0, max: 1000 }),
            accumDepr: fc.integer({ min: 0, max: 1000 }),
            land: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.array(fc.record({
            acntPayAccLia: fc.integer({ min: 0, max: 1000 }),
            dueToFun: fc.integer({ min: 0, max: 1000 }),
            dueToOthFun: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            accrVac: fc.integer({ min: 0, max: 1000 }),
            wrkComp: fc.integer({ min: 0, max: 1000 }),
            acrManRetPln: fc.integer({ min: 0, max: 1000 }),
            acrLeasGuarOb: fc.integer({ min: 0, max: 1000 }),
            capLeasOb: fc.integer({ min: 0, max: 1000 }),
            notPayBuilA: fc.integer({ min: 0, max: 1000 }),
            netPenLia: fc.integer({ min: 0, max: 1000 }),
            netOPEBLia: fc.integer({ min: 0, max: 1000 }),
            lineOfCredA: fc.integer({ min: 0, max: 1000 }),
            lineOfCredB: fc.integer({ min: 0, max: 1000 }),
            debtServ: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            accrVac: fc.integer({ min: 0, max: 1000 }),
            wrkComp: fc.integer({ min: 0, max: 1000 }),
            acrManRetPln: fc.integer({ min: 0, max: 1000 }),
            acrLeasGuarOb: fc.integer({ min: 0, max: 1000 }),
            capLeasOb: fc.integer({ min: 0, max: 1000 }),
            notPayBuilA: fc.integer({ min: 0, max: 1000 }),
            netPenLia: fc.integer({ min: 0, max: 1000 }),
            netOPEBLia: fc.integer({ min: 0, max: 1000 }),
            lineOfCredA: fc.integer({ min: 0, max: 1000 }),
            lineOfCredB: fc.integer({ min: 0, max: 1000 }),
            debtServ: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.array(fc.record({
            invCapAssNetDbt: fc.integer({ min: 0, max: 1000 }),
            rstrFedFun: fc.integer({ min: 0, max: 1000 }),
            unRstr: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            investPort: fc.integer({ min: 0, max: 1000 }),
            revs: fc.integer({ min: 0, max: 1000 }),
            genFund: fc.integer({ min: 0, max: 1000 }),
            coreOpBudget: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            personnel: fc.integer({ min: 0, max: 1000 }),
            program: fc.integer({ min: 0, max: 1000 }),
            contracts: fc.integer({ min: 0, max: 1000 }),
            grants: fc.integer({ min: 0, max: 1000 }),
            travel: fc.integer({ min: 0, max: 1000 }),
            equip: fc.integer({ min: 0, max: 1000 }),
            overhead: fc.integer({ min: 0, max: 1000 }),
            deptServ: fc.integer({ min: 0, max: 1000 }),
            other: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          (
            owner,
            worksheetName,
            year,
            cashStuff,
            other,
            investments,
            loanFund,
            assets,
            land,
            compBAssets,
            rstrCash,
            pensionRsrcs,
            OPEBRsrcs,
            liabilities,
            longTermInYear,
            longTermAftYear,
            pensionRsrcsInflow,
            OPEBRsrcsInflow,
            commitConting,
            revenue,
            expenses,
            salary,
            management,
            supServ,
            benAdv,
          ) => {
            const definitionData =
              { owner, worksheetName, year, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear,
                pensionRsrcsInflow, OPEBRsrcsInflow, commitConting, revenue, expenses, salary, management, supServ, benAdv };
            testDefine(collection, definitionData);
          },
        ),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const owner = faker.internet.email();
      const worksheetName = faker.lorem.words();
      const year = faker.datatype.number({ min: 0, max: 10 });
      const cashStuff = [
        { pettyCash: faker.datatype.number({ min: 0, max: 1000 }),
          cash: faker.datatype.number({ min: 0, max: 1000 }),
          cashBankCred: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const other = [
        { actRec: faker.datatype.number({ min: 0, max: 1000 }),
          dueFromFund: faker.datatype.number({ min: 0, max: 1000 }),
          intDivRec: faker.datatype.number({ min: 0, max: 1000 }),
          invPrepaid: faker.datatype.number({ min: 0, max: 1000 }),
          notesDueInYr: faker.datatype.number({ min: 0, max: 1000 }),
          notesDueAftYr: faker.datatype.number({ min: 0, max: 1000 }),
          secDep: faker.datatype.number({ min: 0, max: 1000 }),
          cashHeldByInvMng: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const investments = [
        { mutFun: faker.datatype.number({ min: 0, max: 1000 }),
          comFun: faker.datatype.number({ min: 0, max: 1000 }),
          hdgFun: faker.datatype.number({ min: 0, max: 1000 }),
          privEqt: faker.datatype.number({ min: 0, max: 1000 }),
          comnTrustFun: faker.datatype.number({ min: 0, max: 1000 }),
          comPrefStock: faker.datatype.number({ min: 0, max: 1000 }),
          privDbt: faker.datatype.number({ min: 0, max: 1000 }),
          other: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const loanFund = [
        { usTreas: faker.datatype.number({ min: 0, max: 1000 }),
          usAgenc: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const assets = [
        { bldngs: faker.datatype.number({ min: 0, max: 1000 }),
          leashldImprv: faker.datatype.number({ min: 0, max: 1000 }),
          frnFixEqp: faker.datatype.number({ min: 0, max: 1000 }),
          accumDepr: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const land = [
        { landA: faker.datatype.number({ min: 0, max: 1000 }),
          landB: faker.datatype.number({ min: 0, max: 1000 }),
          cnstrProg: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const compBAssets = [
        { bldngs: faker.datatype.number({ min: 0, max: 1000 }),
          leashldImprv: faker.datatype.number({ min: 0, max: 1000 }),
          frnFixEqp: faker.datatype.number({ min: 0, max: 1000 }),
          vehcl: faker.datatype.number({ min: 0, max: 1000 }),
          accumDepr: faker.datatype.number({ min: 0, max: 1000 }),
          land: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const rstrCash = faker.datatype.number({ min: 0, max: 1000 });
      const pensionRsrcs = faker.datatype.number({ min: 0, max: 1000 });
      const OPEBRsrcs = faker.datatype.number({ min: 0, max: 1000 });
      const liabilities = [
        { acntPayAccLia: faker.datatype.number({ min: 0, max: 1000 }),
          dueToFun: faker.datatype.number({ min: 0, max: 1000 }),
          dueToOthFun: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const longTermInYear = [
        { accrVac: faker.datatype.number({ min: 0, max: 1000 }),
          wrkComp: faker.datatype.number({ min: 0, max: 1000 }),
          acrManRetPln: faker.datatype.number({ min: 0, max: 1000 }),
          acrLeasGuarOb: faker.datatype.number({ min: 0, max: 1000 }),
          capLeasOb: faker.datatype.number({ min: 0, max: 1000 }),
          notPayBuilA: faker.datatype.number({ min: 0, max: 1000 }),
          netPenLia: faker.datatype.number({ min: 0, max: 1000 }),
          netOPEBLia: faker.datatype.number({ min: 0, max: 1000 }),
          lineOfCredA: faker.datatype.number({ min: 0, max: 1000 }),
          lineOfCredB: faker.datatype.number({ min: 0, max: 1000 }),
          debtServ: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const longTermAftYear = [
        { accrVac: faker.datatype.number({ min: 0, max: 1000 }),
          wrkComp: faker.datatype.number({ min: 0, max: 1000 }),
          acrManRetPln: faker.datatype.number({ min: 0, max: 1000 }),
          acrLeasGuarOb: faker.datatype.number({ min: 0, max: 1000 }),
          capLeasOb: faker.datatype.number({ min: 0, max: 1000 }),
          notPayBuilA: faker.datatype.number({ min: 0, max: 1000 }),
          netPenLia: faker.datatype.number({ min: 0, max: 1000 }),
          netOPEBLia: faker.datatype.number({ min: 0, max: 1000 }),
          lineOfCredA: faker.datatype.number({ min: 0, max: 1000 }),
          lineOfCredB: faker.datatype.number({ min: 0, max: 1000 }),
          debtServ: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const pensionRsrcsInflow = faker.datatype.number({ min: 0, max: 1000 });
      const OPEBRsrcsInflow = faker.datatype.number({ min: 0, max: 1000 });
      const commitConting = [
        { invCapAssNetDbt: faker.datatype.number({ min: 0, max: 1000 }),
          rstrFedFun: faker.datatype.number({ min: 0, max: 1000 }),
          unRstr: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const revenue = [
        { investPort: faker.datatype.number({ min: 0, max: 1000 }),
          revs: faker.datatype.number({ min: 0, max: 1000 }),
          genFund: faker.datatype.number({ min: 0, max: 1000 }),
          coreOpBudget: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const expenses = [
        { personnel: faker.datatype.number({ min: 0, max: 1000 }),
          program: faker.datatype.number({ min: 0, max: 1000 }),
          contracts: faker.datatype.number({ min: 0, max: 1000 }),
          grants: faker.datatype.number({ min: 0, max: 1000 }),
          travel: faker.datatype.number({ min: 0, max: 1000 }),
          equip: faker.datatype.number({ min: 0, max: 1000 }),
          overhead: faker.datatype.number({ min: 0, max: 1000 }),
          deptServ: faker.datatype.number({ min: 0, max: 1000 }),
          other: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const salary = faker.datatype.number({ min: 0, max: 1000 });
      const management = faker.datatype.number({ min: 0, max: 1000 });
      const supServ = faker.datatype.number({ min: 0, max: 1000 });
      const benAdv = faker.datatype.number({ min: 0, max: 1000 });
      const docID1 = collection.define({
        owner, worksheetName, year, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear,
        pensionRsrcsInflow, OPEBRsrcsInflow, commitConting, revenue, expenses, salary, management, supServ, benAdv,
      });
      const docID2 = collection.define({
        owner, worksheetName, year, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear,
        pensionRsrcsInflow, OPEBRsrcsInflow, commitConting, revenue, expenses, salary, management, supServ, benAdv,
      });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const owner = faker.internet.email();
      const worksheetName = faker.lorem.words();
      const year = faker.datatype.number({ min: 0, max: 10 });
      const cashStuff = [
        { pettyCash: faker.datatype.number({ min: 0, max: 1000 }),
          cash: faker.datatype.number({ min: 0, max: 1000 }),
          cashBankCred: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const other = [
        { actRec: faker.datatype.number({ min: 0, max: 1000 }),
          dueFromFund: faker.datatype.number({ min: 0, max: 1000 }),
          intDivRec: faker.datatype.number({ min: 0, max: 1000 }),
          invPrepaid: faker.datatype.number({ min: 0, max: 1000 }),
          notesDueInYr: faker.datatype.number({ min: 0, max: 1000 }),
          notesDueAftYr: faker.datatype.number({ min: 0, max: 1000 }),
          secDep: faker.datatype.number({ min: 0, max: 1000 }),
          cashHeldByInvMng: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const investments = [
        { mutFun: faker.datatype.number({ min: 0, max: 1000 }),
          comFun: faker.datatype.number({ min: 0, max: 1000 }),
          hdgFun: faker.datatype.number({ min: 0, max: 1000 }),
          privEqt: faker.datatype.number({ min: 0, max: 1000 }),
          comnTrustFun: faker.datatype.number({ min: 0, max: 1000 }),
          comPrefStock: faker.datatype.number({ min: 0, max: 1000 }),
          privDbt: faker.datatype.number({ min: 0, max: 1000 }),
          other: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const loanFund = [
        { usTreas: faker.datatype.number({ min: 0, max: 1000 }),
          usAgenc: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const assets = [
        { bldngs: faker.datatype.number({ min: 0, max: 1000 }),
          leashldImprv: faker.datatype.number({ min: 0, max: 1000 }),
          frnFixEqp: faker.datatype.number({ min: 0, max: 1000 }),
          accumDepr: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const land = [
        { landA: faker.datatype.number({ min: 0, max: 1000 }),
          landB: faker.datatype.number({ min: 0, max: 1000 }),
          cnstrProg: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const compBAssets = [
        { bldngs: faker.datatype.number({ min: 0, max: 1000 }),
          leashldImprv: faker.datatype.number({ min: 0, max: 1000 }),
          frnFixEqp: faker.datatype.number({ min: 0, max: 1000 }),
          vehcl: faker.datatype.number({ min: 0, max: 1000 }),
          accumDepr: faker.datatype.number({ min: 0, max: 1000 }),
          land: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const rstrCash = faker.datatype.number({ min: 0, max: 1000 });
      const pensionRsrcs = faker.datatype.number({ min: 0, max: 1000 });
      const OPEBRsrcs = faker.datatype.number({ min: 0, max: 1000 });
      const liabilities = [
        { acntPayAccLia: faker.datatype.number({ min: 0, max: 1000 }),
          dueToFun: faker.datatype.number({ min: 0, max: 1000 }),
          dueToOthFun: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const longTermInYear = [
        { accrVac: faker.datatype.number({ min: 0, max: 1000 }),
          wrkComp: faker.datatype.number({ min: 0, max: 1000 }),
          acrManRetPln: faker.datatype.number({ min: 0, max: 1000 }),
          acrLeasGuarOb: faker.datatype.number({ min: 0, max: 1000 }),
          capLeasOb: faker.datatype.number({ min: 0, max: 1000 }),
          notPayBuilA: faker.datatype.number({ min: 0, max: 1000 }),
          netPenLia: faker.datatype.number({ min: 0, max: 1000 }),
          netOPEBLia: faker.datatype.number({ min: 0, max: 1000 }),
          lineOfCredA: faker.datatype.number({ min: 0, max: 1000 }),
          lineOfCredB: faker.datatype.number({ min: 0, max: 1000 }),
          debtServ: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const longTermAftYear = [
        { accrVac: faker.datatype.number({ min: 0, max: 1000 }),
          wrkComp: faker.datatype.number({ min: 0, max: 1000 }),
          acrManRetPln: faker.datatype.number({ min: 0, max: 1000 }),
          acrLeasGuarOb: faker.datatype.number({ min: 0, max: 1000 }),
          capLeasOb: faker.datatype.number({ min: 0, max: 1000 }),
          notPayBuilA: faker.datatype.number({ min: 0, max: 1000 }),
          netPenLia: faker.datatype.number({ min: 0, max: 1000 }),
          netOPEBLia: faker.datatype.number({ min: 0, max: 1000 }),
          lineOfCredA: faker.datatype.number({ min: 0, max: 1000 }),
          lineOfCredB: faker.datatype.number({ min: 0, max: 1000 }),
          debtServ: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const pensionRsrcsInflow = faker.datatype.number({ min: 0, max: 1000 });
      const OPEBRsrcsInflow = faker.datatype.number({ min: 0, max: 1000 });
      const commitConting = [
        { invCapAssNetDbt: faker.datatype.number({ min: 0, max: 1000 }),
          rstrFedFun: faker.datatype.number({ min: 0, max: 1000 }),
          unRstr: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const revenue = [
        { investPort: faker.datatype.number({ min: 0, max: 1000 }),
          revs: faker.datatype.number({ min: 0, max: 1000 }),
          genFund: faker.datatype.number({ min: 0, max: 1000 }),
          coreOpBudget: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const expenses = [
        { personnel: faker.datatype.number({ min: 0, max: 1000 }),
          program: faker.datatype.number({ min: 0, max: 1000 }),
          contracts: faker.datatype.number({ min: 0, max: 1000 }),
          grants: faker.datatype.number({ min: 0, max: 1000 }),
          travel: faker.datatype.number({ min: 0, max: 1000 }),
          equip: faker.datatype.number({ min: 0, max: 1000 }),
          overhead: faker.datatype.number({ min: 0, max: 1000 }),
          deptServ: faker.datatype.number({ min: 0, max: 1000 }),
          other: faker.datatype.number({ min: 0, max: 1000 }),
        },
      ];
      const salary = faker.datatype.number({ min: 0, max: 1000 });
      const management = faker.datatype.number({ min: 0, max: 1000 });
      const supServ = faker.datatype.number({ min: 0, max: 1000 });
      const benAdv = faker.datatype.number({ min: 0, max: 1000 });
      const docID = collection.define({
        owner, worksheetName, year, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear,
        pensionRsrcsInflow, OPEBRsrcsInflow, commitConting, revenue, expenses, salary, management, supServ, benAdv,
      });
      // console.log(collection.findDoc(docID));
      fc.assert(
        fc.property(
          fc.array(fc.record({
            pettyCash: fc.integer({ min: 0, max: 1000 }),
            cash: fc.integer({ min: 0, max: 1000 }),
            cashBankCred: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            actRec: fc.integer({ min: 0, max: 1000 }),
            dueFromFund: fc.integer({ min: 0, max: 1000 }),
            intDivRec: fc.integer({ min: 0, max: 1000 }),
            invPrepaid: fc.integer({ min: 0, max: 1000 }),
            notesDueInYr: fc.integer({ min: 0, max: 1000 }),
            notesDueAftYr: fc.integer({ min: 0, max: 1000 }),
            secDep: fc.integer({ min: 0, max: 1000 }),
            cashHeldByInvMng: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            mutFun: fc.integer({ min: 0, max: 1000 }),
            comFun: fc.integer({ min: 0, max: 1000 }),
            hdgFun: fc.integer({ min: 0, max: 1000 }),
            privEqt: fc.integer({ min: 0, max: 1000 }),
            comnTrustFun: fc.integer({ min: 0, max: 1000 }),
            comPrefStock: fc.integer({ min: 0, max: 1000 }),
            privDbt: fc.integer({ min: 0, max: 1000 }),
            other: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            usTreas: fc.integer({ min: 0, max: 1000 }),
            usAgenc: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            bldngs: fc.integer({ min: 0, max: 1000 }),
            leashldImprv: fc.integer({ min: 0, max: 1000 }),
            frnFixEqp: fc.integer({ min: 0, max: 1000 }),
            accumDepr: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            landA: fc.integer({ min: 0, max: 1000 }),
            landB: fc.integer({ min: 0, max: 1000 }),
            cnstrProg: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            bldngs: fc.integer({ min: 0, max: 1000 }),
            leashldImprv: fc.integer({ min: 0, max: 1000 }),
            frnFixEqp: fc.integer({ min: 0, max: 1000 }),
            vehcl: fc.integer({ min: 0, max: 1000 }),
            accumDepr: fc.integer({ min: 0, max: 1000 }),
            land: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.array(fc.record({
            acntPayAccLia: fc.integer({ min: 0, max: 1000 }),
            dueToFun: fc.integer({ min: 0, max: 1000 }),
            dueToOthFun: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            accrVac: fc.integer({ min: 0, max: 1000 }),
            wrkComp: fc.integer({ min: 0, max: 1000 }),
            acrManRetPln: fc.integer({ min: 0, max: 1000 }),
            acrLeasGuarOb: fc.integer({ min: 0, max: 1000 }),
            capLeasOb: fc.integer({ min: 0, max: 1000 }),
            notPayBuilA: fc.integer({ min: 0, max: 1000 }),
            netPenLia: fc.integer({ min: 0, max: 1000 }),
            netOPEBLia: fc.integer({ min: 0, max: 1000 }),
            lineOfCredA: fc.integer({ min: 0, max: 1000 }),
            lineOfCredB: fc.integer({ min: 0, max: 1000 }),
            debtServ: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            accrVac: fc.integer({ min: 0, max: 1000 }),
            wrkComp: fc.integer({ min: 0, max: 1000 }),
            acrManRetPln: fc.integer({ min: 0, max: 1000 }),
            acrLeasGuarOb: fc.integer({ min: 0, max: 1000 }),
            capLeasOb: fc.integer({ min: 0, max: 1000 }),
            notPayBuilA: fc.integer({ min: 0, max: 1000 }),
            netPenLia: fc.integer({ min: 0, max: 1000 }),
            netOPEBLia: fc.integer({ min: 0, max: 1000 }),
            lineOfCredA: fc.integer({ min: 0, max: 1000 }),
            lineOfCredB: fc.integer({ min: 0, max: 1000 }),
            debtServ: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.array(fc.record({
            invCapAssNetDbt: fc.integer({ min: 0, max: 1000 }),
            rstrFedFun: fc.integer({ min: 0, max: 1000 }),
            unRstr: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            investPort: fc.integer({ min: 0, max: 1000 }),
            revs: fc.integer({ min: 0, max: 1000 }),
            genFund: fc.integer({ min: 0, max: 1000 }),
            coreOpBudget: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.array(fc.record({
            personnel: fc.integer({ min: 0, max: 1000 }),
            program: fc.integer({ min: 0, max: 1000 }),
            contracts: fc.integer({ min: 0, max: 1000 }),
            grants: fc.integer({ min: 0, max: 1000 }),
            travel: fc.integer({ min: 0, max: 1000 }),
            equip: fc.integer({ min: 0, max: 1000 }),
            overhead: fc.integer({ min: 0, max: 1000 }),
            deptServ: fc.integer({ min: 0, max: 1000 }),
            other: fc.integer({ min: 0, max: 1000 }),
          })),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 1000 }),
          (
            newCashStuff,
            newOther,
            newInvestments,
            newLoanFund,
            newAssets,
            newLand,
            newCompBAssets,
            newRstrCash,
            newPensionRsrcs,
            newOPEBRsrcs,
            newLiabilities,
            newLongTermInYear,
            newLongTermAftYear,
            newPensionRsrcsInflow,
            newOPEBRsrcsInflow,
            newCommitConting,
            newRevenue,
            newExpenses,
            newSalary,
            newManagement,
            newSupServ,
            newBenAdv,
          ) => {
            // console.log('update', index, stuffConditions[index]);
            const updateData = {
              cashStuff: newCashStuff,
              other: newOther,
              investments: newInvestments,
              loanFund: newLoanFund,
              assets: newAssets,
              land: newLand,
              compBAssets: newCompBAssets,
              rstrCash: newRstrCash,
              pensionRsrcs: newPensionRsrcs,
              OPEBRsrcs: newOPEBRsrcs,
              liabilities: newLiabilities,
              longTermInYear: newLongTermInYear,
              longTermAftYear: newLongTermAftYear,
              pensionRsrcsInflow: newPensionRsrcsInflow,
              OPEBRsrcsInflow: newOPEBRsrcsInflow,
              commitConting: newCommitConting,
              revenue: newRevenue,
              expenses: newExpenses,
              salary: newSalary,
              management: newManagement,
              supServ: newSupServ,
              benAdv: newBenAdv,
            };
            testDataUpdate(collection, docID, updateData);
          },
        ),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      testDumpRestore(collection);
    });
  });
}
