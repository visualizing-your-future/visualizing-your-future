import React from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { WP2503 } from '../../api/WP2503/WP2503';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';

const WP2503Page = () => {
  const { ready, wp2503 } = useTracker(() => {
    const subscription = WP2503.subscribeWP2503();
    const rdy = subscription.ready();
    const wp2503Data = WP2503.find({}, { sort: { year: 1 } }).fetch();
    return {
      wp2503: wp2503Data,
      ready: rdy,
    };
  }, []);

  // Extract unique years from wp2503 data for column headers
  const years = wp2503.map(entry => entry.year).slice(1);
  const year1Data = wp2503.find(entry => entry.year === 1);

  // Define each benefit type row
  const benefitTypes = [
    { key: 'penAcc', label: 'Pension Accumulation' },
    { key: 'retHlthInsur', label: 'Retiree Health Insurance' },
    { key: 'othrPostEmpBen', label: 'Other Post Employment Benefits' },
    { key: 'empHlthFnd', label: 'Employee Health Fund' },
    { key: 'SS', label: 'Social Security' },
    { key: 'medicare', label: 'Medicare' },
    { key: 'wrkComp', label: 'Worker’s Compensation' },
    { key: 'unempComp', label: 'Unemployment Compensation' },
    { key: 'penAdm', label: 'Pension Administration' },
  ];

  // Function to calculate the composite rate for a given year
  const calculateCompositeRate = (yearData) => {
    const total = benefitTypes.reduce((sum, benefit) => sum + (yearData[benefit.key] || 0), 0);
    return total.toFixed(2);
  };

  // Function to calculate year-to-year growth rates for each benefit type
  const calculateGrowthRates = (benefitKey) => {
    const rates = years.map(year => {
      const yearData = wp2503.find(entry => entry.year === year);
      return yearData ? yearData[benefitKey] : null;
    });

    const growthRates = rates.slice(1).map((rate, index) => {
      const previousRate = rates[index];
      return previousRate ? (((rate - previousRate) / previousRate) * 100) : '-';
    });

    // Calculate the 3-year average growth rate for the last 3 values
    const lastThreeGrowthRates = growthRates.slice(-3);
    const threeYearAverage = lastThreeGrowthRates.every(rate => rate !== '-')
      ? (lastThreeGrowthRates.reduce((sum, rate) => sum + parseFloat(rate), 0) / 3)
      : '-';

    return { growthRates, threeYearAverage };
  };

  // Specific calculation for otherPostEmpBen's 3-year average growth rate
  const calculateOtherPostEmpAvg = () => {
    const year9 = wp2503.find(entry => entry.year === 9);
    if (year9) {
      const year9OthrPostEmpBen = year9.othrPostEmpBen || 0;
      return ((17 - year9OthrPostEmpBen) / (2041 - 2018));
    }
    return '-';
  };

  // Function to calculate the average rate for a given benefit type based on available years
  const calculateAverage = (benefitKey) => {
    const values = years.map(year => {
      const yearData = wp2503.find(entry => entry.year === year);
      return yearData ? parseFloat(yearData[benefitKey]) : 0;
    });

    const valuesToAverage = values.slice(0, 5);

    return valuesToAverage.length > 0
      ? (valuesToAverage.reduce((acc, val) => acc + val, 0) / valuesToAverage.length).toFixed(2)
      : '-';
  };

  // Get the 3-year average growth rate for Pension Accumulation
  const pensionAccumulationGrowth = parseFloat(calculateGrowthRates('penAcc').threeYearAverage) / 100;
  const retireeHealthInsuranceGrowth = parseFloat(calculateGrowthRates('retHlthInsur').threeYearAverage) / 100;
  const otherPostEmpBenefitGrowth = parseFloat(calculateOtherPostEmpAvg()) || 0;
  const empHealthFundGrowth = parseFloat(calculateGrowthRates('empHlthFnd').threeYearAverage) / 100;
  const averageSSRate = calculateAverage('SS');
  const averageMedicareRate = calculateAverage('medicare');
  const workersCompGrowth = parseFloat(calculateGrowthRates('wrkComp').threeYearAverage) / 100;
  const unemploymentCompGrowth = parseFloat(calculateGrowthRates('unempComp').threeYearAverage) / 100;
  const averagePenAdmRate = calculateAverage('penAdm');

  const projectedData = {
    penAcc: [[year1Data ? Number(year1Data.penAcc) : 0]],
    retHlthInsur: [[year1Data ? Number(year1Data.retHlthInsur) : 0]],
    othrPostEmpBen: [[year1Data ? Number(year1Data.othrPostEmpBen) : 0]],
    empHlthFnd: [[year1Data ? Number(year1Data.empHlthFnd) : 0]],
    wrkComp: [[year1Data ? Number(year1Data.wrkComp) : 0]],
    unempComp: [[year1Data ? Number(year1Data.unempComp) : 0]],
    SS: [[year1Data ? Number(year1Data.SS) : Number(averageSSRate)]],
    medicare: [[year1Data ? Number(year1Data.medicare) : Number(averageMedicareRate)]],
    penAdm: [[year1Data ? Number(year1Data.penAdm) : Number(averagePenAdmRate)]],
  };

  // Calculate values for subsequent years based on the provided formula
  for (let year = 2; year <= 12; year++) {
    const previousPenAccValue = Number(projectedData.penAcc[year - 2][0]);
    const newPenAccValue = (1 + pensionAccumulationGrowth) * previousPenAccValue;
    projectedData.penAcc.push([newPenAccValue]);

    const previousRetHlthInsurValue = Number(projectedData.retHlthInsur[year - 2][0]);
    const newRetHlthInsurValue = (1 + retireeHealthInsuranceGrowth) * previousRetHlthInsurValue;
    projectedData.retHlthInsur.push([newRetHlthInsurValue]);

    const previousOthrPostEmpBenValue = Number(projectedData.othrPostEmpBen[year - 2][0]);
    const newOthrPostEmpBenValue = previousOthrPostEmpBenValue + otherPostEmpBenefitGrowth;
    projectedData.othrPostEmpBen.push([newOthrPostEmpBenValue]);

    const previousEmpHlthFndValue = Number(projectedData.empHlthFnd[year - 2][0]);
    const newEmpHlthFndValue = (1 + empHealthFundGrowth) * previousEmpHlthFndValue;
    projectedData.empHlthFnd.push([newEmpHlthFndValue]);

    const previousWrkCompValue = Number(projectedData.wrkComp[year - 2][0]);
    const newWrkCompValue = (1 + workersCompGrowth) * previousWrkCompValue;
    projectedData.wrkComp.push([newWrkCompValue]);

    const previousUnempCompValue = Number(projectedData.unempComp[year - 2][0]);
    const newUnempCompValue = (1 + unemploymentCompGrowth) * previousUnempCompValue;
    projectedData.unempComp.push([newUnempCompValue]);

    // Keep SS, Medicare, and Pen Admin values constant across years
    projectedData.SS.push([Number(averageSSRate)]);
    projectedData.medicare.push([Number(averageMedicareRate)]);
    projectedData.penAdm.push([Number(averagePenAdmRate)]);
  }

  // Function to calculate the composite rate for each column in the projected data
  const calculateCompositeRow = () => projectedData.penAcc.map((_, index) => {
    const columnSum = Object.keys(projectedData).reduce((sum, key) => {
      const value = projectedData[key][index][0];
      return sum + value;
    }, 0);
    return columnSum.toFixed(2);
  });

  // Get the composite row values
  const compositeRow = calculateCompositeRow();

  return (ready ? (
    <Container fluid id={PAGE_IDS.WP_2503} className="py-3">
      <Row className="justify-content-start">
        <Col>
          <h2>Approved Fringe Benefit Rates</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Benefit Type</th>
                {years.map((year) => (
                  <th key={year}>Year {year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benefitTypes.map((benefit) => (
                <tr key={benefit.key}>
                  <td>{benefit.label}</td>
                  {years.map((year) => {
                    const yearData = wp2503.find(entry => entry.year === year);
                    return (
                      <td key={`${benefit.key}-${year}`}>
                        {yearData ? yearData[benefit.key] : '-'}%
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td><strong>Composite Rate</strong></td>
                {years.map((year) => {
                  const yearData = wp2503.find(entry => entry.year === year);
                  const compositeRate = yearData ? calculateCompositeRate(yearData) : '-';
                  return (
                    <td key={`composite-${year}`}>
                      <strong>{compositeRate}%</strong>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {projectedData.penAcc.map((_, index) => (
                  <th key={`year1-${index + 1}`}>Year {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {projectedData.penAcc.map((value, index) => (
                  <td key={`penAcc-${index}`}>{value[0].toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                {projectedData.retHlthInsur.map((value, index) => (
                  <td key={`retHlthInsur-${index}`}>{value[0].toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                {projectedData.othrPostEmpBen.map((value, index) => (
                  <td key={`othrPostEmpBen-${index}`}>{value[0].toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                {projectedData.empHlthFnd.map((value, index) => (
                  <td key={`empHlthFnd-${index}`}>{value[0].toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                {projectedData.SS.map((value, index) => (
                  <td key={`SS-${index}`}>{value[0].toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                {projectedData.medicare.map((value, index) => (
                  <td key={`medicare-${index}`}>{value[0].toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                {projectedData.wrkComp.map((value, index) => (
                  <td key={`wrkComp-${index}`}>{value[0].toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                {projectedData.unempComp.map((value, index) => (
                  <td key={`unempComp-${index}`}>{value[0].toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                {projectedData.penAdm.map((value, index) => (
                  <td key={`penAdm-${index}`}>{value[0].toFixed(2)}%</td>
                ))}
              </tr>
              <tr>
                {compositeRow.map((total, index) => (
                  <td key={`composite-${index}`}><strong>{total}%</strong></td>
                ))}
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Col md={6}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Growth of Rates from Y-t-Y</th>
              {years.slice(1).map((year) => (
                <th key={year} aria-hidden="true" />
              ))}
              <th>3-Year Average</th>
            </tr>
          </thead>
          <tbody>
            {benefitTypes.map((benefit) => {
              const isSpecialCase = benefit.key === 'othrPostEmpBen' || benefit.key === 'penAdm';
              const growthData = isSpecialCase
                ? {
                  growthRates: years.slice(1).map(() => ''),
                  threeYearAverage: benefit.key === 'othrPostEmpBen' ? calculateOtherPostEmpAvg() : '',
                }
                : calculateGrowthRates(benefit.key);

              const { growthRates, threeYearAverage } = growthData;

              let displayedAverage = '';
              if (benefit.key !== 'penAdm' && typeof threeYearAverage === 'number') {
                displayedAverage = `${threeYearAverage.toFixed(2)}%`;
              }

              return (
                <tr key={`growth-${benefit.key}`}>
                  <td>{benefit.label}</td>
                  {growthRates.map((growthRate, index) => (
                    <td key={`${benefit.key}-growth-${index}`}>
                      {typeof growthRate === 'number' ? `${growthRate.toFixed(2)}%` : ''}
                    </td>
                  ))}
                  <td>
                    <strong>{displayedAverage}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Col>
      <Row className="mt-5">
        <Col>
          <h3>Composite - Growth in All Categories</h3>
          <Col className="mx-auto" md={2}>
            <Table bordered responsive>
              <tbody>
                <tr>
                  <td><strong>Multiplier - Composite</strong></td>
                  <td>1.02</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Benefit Type</th>
                {years.map((year) => (
                  <th key={year}>Year {year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benefitTypes.map((benefit) => (
                <tr key={benefit.key}>
                  <td>{benefit.label}</td>
                  {years.map((year) => {
                    const yearData = wp2503.find(entry => entry.year === year);
                    return (
                      <td key={`${benefit.key}-${year}`}>
                        {yearData ? yearData[benefit.key] : '-'}%
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td><strong>Composite Rate</strong></td>
                {years.map((year) => {
                  const yearData = wp2503.find(entry => entry.year === year);
                  const compositeRate = yearData ? calculateCompositeRate(yearData) : '-';
                  return (
                    <td key={`composite-${year}`}>
                      <strong>{compositeRate}%</strong>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {projectedData.penAcc.map((_, index) => (
                  <th key={`year1-${index + 1}`}>Year {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benefitTypes.map((benefit) => {
                const values = [];
                let currentValue = year1Data ? Number(year1Data[benefit.key]) : 0;

                // Track column sums for each year
                projectedData.penAcc.forEach((_, index) => {
                  if (!projectedData[`sum-${index}`]) projectedData[`sum-${index}`] = 0;
                });

                // Generate values for each year by incrementing by 1.019353 and adding to column sum
                for (let i = 0; i < projectedData.penAcc.length; i++) {
                  values.push(`${currentValue.toFixed(2)}%`);
                  projectedData[`sum-${i}`] += currentValue; // Add current value to column sum
                  currentValue *= 1.019353; // Increment for the next year
                }

                return (
                  <tr key={benefit.key}>
                    {values.map((value, index) => (
                      <td key={`${benefit.key}-year-${index + 1}`}>{value}</td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                {projectedData.penAcc.map((_, index) => (
                  <td key={`sum-${index}`}>
                    <strong>{projectedData[`sum-${index}`].toFixed(2)}%</strong>
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <h3>OPEB Only</h3>
          <Col className="mx-auto" md={2}>
            <Table bordered responsive>
              <tbody>
                <tr>
                  <td><strong>Multiplier - OPEB only</strong></td>
                  <td>1.07</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Benefit Type</th>
                {years.map((year) => (
                  <th key={year}>Year {year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benefitTypes.map((benefit) => (
                <tr key={benefit.key}>
                  <td>{benefit.label}</td>
                  {years.map((year) => {
                    const yearData = wp2503.find(entry => entry.year === year);
                    return (
                      <td key={`${benefit.key}-${year}`}>
                        {yearData ? yearData[benefit.key] : '-'}%
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td><strong>Composite Rate</strong></td>
                {years.map((year) => {
                  const yearData = wp2503.find(entry => entry.year === year);
                  const compositeRate = yearData ? calculateCompositeRate(yearData) : '-';
                  return (
                    <td key={`composite-${year}`}>
                      <strong>{compositeRate}%</strong>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {projectedData.penAcc.map((_, index) => (
                  <th key={`year-${index + 1}`}>Year {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benefitTypes.map((benefit) => {
                const values = [];
                let currentValue = year1Data ? Number(year1Data[benefit.key]) : 0;

                // Create an array to store the column sums and initialize to 0 if not already done
                if (!projectedData.columnSums) {
                  projectedData.columnSums = Array(projectedData.penAcc.length).fill(0);
                }

                // Populate values for each year, increasing only for "Other Post Employment Benefits"
                for (let i = 0; i < projectedData.penAcc.length; i++) {
                  if (benefit.key === 'othrPostEmpBen' && i > 0) {
                    currentValue *= 1.06577; // Increase by 7% for each year after the first
                  }
                  values.push(`${currentValue.toFixed(2)}%`);
                  projectedData.columnSums[i] += currentValue; // Add to the column sum
                }

                return (
                  <tr key={benefit.key}>
                    {values.map((value, index) => (
                      <td key={`${benefit.key}-year-${index + 1}`}>{value}</td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                {projectedData.columnSums.map((sum, index) => (
                  <td key={`sum-${index}`}>
                    <strong>{sum.toFixed(2)}%</strong>
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </Col>

      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Approved Fringe Benefit Rates" />);
};

export default WP2503Page;
