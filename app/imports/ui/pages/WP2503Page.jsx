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
  const years = wp2503.map(entry => entry.year);

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
      return previousRate ? (((rate - previousRate) / previousRate) * 100).toFixed(2) : '-';
    });

    // Calculate the 3-year average growth rate for the last 3 values
    const lastThreeGrowthRates = growthRates.slice(-3);
    const threeYearAverage = lastThreeGrowthRates.every(rate => rate !== '-')
      ? (lastThreeGrowthRates.reduce((sum, rate) => sum + parseFloat(rate), 0) / 3).toFixed(2)
      : '-';

    return { growthRates, threeYearAverage };
  };

  // Specific calculation for otherPostEmpBen's 3-year average growth rate
  const calculateOtherPostEmpAvg = () => {
    const year9 = wp2503.find(entry => entry.year === 9);
    if (year9) {
      const year9OthrPostEmpBen = year9.othrPostEmpBen || 0;
      return ((17 - year9OthrPostEmpBen) / (2041 - 2018)).toFixed(2);
    }
    return '-';
  };

  return (ready ? (
    <Container id={PAGE_IDS.WP_2503} className="py-3 mx-5">
      <Row className="justify-content-start">
        <Col>
          <Col>
            <h2>Approved Fringe Benefit Rates</h2>
          </Col>
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
                const { growthRates, threeYearAverage } = isSpecialCase
                  ? { growthRates: years.slice(1).map(() => ''), threeYearAverage: isSpecialCase && benefit.key === 'othrPostEmpBen' ? calculateOtherPostEmpAvg() : '' } // Change '-' to ''
                  : calculateGrowthRates(benefit.key);

                return (
                  <tr key={`growth-${benefit.key}`}>
                    <td>{benefit.label}</td>
                    {growthRates.map((growthRate, index) => (
                      <td key={`${benefit.key}-growth-${index}`}>{growthRate ? `${growthRate}%` : ''}</td>
                    ))}
                    <td><strong>{benefit.key === 'penAdm' ? '' : `${threeYearAverage}%`}</strong></td> {/* Conditionally render the 3-year average */}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Approved Fringe Benefit Rates" />);
};

export default WP2503Page;
