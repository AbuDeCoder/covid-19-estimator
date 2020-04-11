
/**
 * function to convert the timeToElapse to days from any aother periodtype
 * @param {Number} timeToElapse
 * @param {String} periodType //could be days, weeks or months
 * @returns {Number} //the number of days in the specified period
 */
function normaliseTimeToElapseToDays(timeToElapse, periodType) {
  let result = timeToElapse;
  switch (periodType) {
    case 'months':
      result *= 30;
      break;
    case 'weeks':
      result *= 7;
      break;
    default:
      break;
  }
  return result;
}

/**
 * function to compute currentlyInfectedPeaiple given percentage and
 * reported cases
 * @param {Number} percentage
 * @param {Number} reportedCases
 * @returns {Number}
 */
function computeCurrentlyInfected(percentage, reportedCases) {
  return percentage * reportedCases;
}

/**
 * function to compute the infectionsByRequestedTime
 * give currentlyInfected and timeToElapse in days
 * @param {Number} currentlyInfected
 * @param {Number} timeToElapse
 * @returns {Number} //the number of infections estimated
 * to have occured by the requested time
 */
function computeInfectionsByRequestedTime(currentlyInfected, timeToElapse) {
  return currentlyInfected * (2 ** Math.trunc(timeToElapse / 3));
}

/**
 * function to compute the
 * @param {Number} percentage //should be from 0 to 100
 * @param {Number} infectionsByRequestedTime
 * @returns {Number}
 */
function computeSevereCasesByRequestedTime(percentage, infectionsByRequestedTime) {
  return Math.trunc((percentage / 100) * infectionsByRequestedTime);
}

/**
 * function compute hospital beds which will be available or needed
 * given total beds in the hospital,
 * the percentage of beds which can be used for covid-19 patients
 * and the number of severeCases who
 * will need to be admitted in hospital
 * @param {Number} percentage
 * @param {Number} totalHospitalBeds
 * @param {Number} severeCasesByRequestedTime
 * @returns {Number} //the nummber of hospitals availabe or extra beds needed
 */
function computeHospitalBedsByRequestedTime(percentage,
  totalHospitalBeds, severeCasesByRequestedTime) {
  return Math.trunc((percentage / 100) * totalHospitalBeds) - severeCasesByRequestedTime;
}

/**
 * function to compute the number of cases that will need intensive case Unit
 * given the percentage of infected cases liked to  need ICU and infectionsByRequestedTime
 * @param {Number} percentage
 * @param {Number} infectionsByRequestedTime
 * @returns {Number}
 */
function computeCasesForICUByRequestedTime(percentage, infectionsByRequestedTime) {
  return Math.trunc((percentage / 100) * infectionsByRequestedTime);
}

/**
 * function to compute the number of cases that will need ventilators
 * given the percentage of infected cases liked to  need ventilators
 * and infectionsByRequestedTime
 * @param {Number} percentage
 * @param {Number} infectionsByRequestedTime
 *  @returns {Number}
 */
function computeCasesForVentilatorsByRequestedTime(percentage, infectionsByRequestedTime) {
  return Math.trunc((percentage / 100) * infectionsByRequestedTime);
}

/**
 * function to compute how much money the economy is likely to lose daily
 * @param {Number} infectionsByRequestedTime
 * @param {Number} avgDailyIncomePopulation
 * @param {Number} avgDailyIncomeInUSD
 * @param {Number} timeToElapse
 *  @returns {Number}
 */
function computeDollarsInFlight(infectionsByRequestedTime, avgDailyIncomePopulation,
  avgDailyIncomeInUSD, timeToElapse) {
  let tempHolder = infectionsByRequestedTime * (avgDailyIncomePopulation / 100);
  tempHolder *= avgDailyIncomeInUSD;
  tempHolder /= timeToElapse;
  return Math.trunc(tempHolder);
}

/**
 * function to determine and return the impact object
 * @param {Object} input
 * @param {Number} timeToElapse
 * @returns {Object} the impact object
 */
function determineImpact(input, timeToElapse) {
  const impact = {
    // the estimated number of currently infected people
    currentlyInfected: computeCurrentlyInfected(10, input.reportedCases)
  };

  // determine and set the estimated number of infected peoples at requested time
  impact.infectionsByRequestedTime = computeInfectionsByRequestedTime(impact.currentlyInfected,
    timeToElapse);

  // determine and set the estimated number of severe cases at requested time
  impact.severeCasesByRequestedTime = computeSevereCasesByRequestedTime(15,
    impact.infectionsByRequestedTime);

  // determine the estimated number of hospital Beds available or needed at requested time
  impact.hospitalBedsByRequestedTime = computeHospitalBedsByRequestedTime(35,
    input.totalHospitalBeds, impact.severeCasesByRequestedTime);

  // determine and set the estimated number of infected people who will need ICU at requested time
  impact.casesForICUByRequestedTime = computeCasesForICUByRequestedTime(5,
    impact.infectionsByRequestedTime);

  // determine the estimated number of infected people who will need ventilators at requested time
  impact.casesForVentilatorsByRequestedTime = computeCasesForVentilatorsByRequestedTime(2,
    impact.infectionsByRequestedTime);

  // determine and set the amount of money in dollars money the economy is likely to lose daily
  impact.dollarsInFlight = computeDollarsInFlight(impact.infectionsByRequestedTime,
    input.avgDailyIncomePopulation,
    input.avgDailyIncomeInUSD, timeToElapse);

  return impact;
}


/**
 * function to determine and return the severeImpact object
 * @param {Object} input
 * @param {Number} timeToElapse
 * @returns {Object} the impact object
 */
function determineSevereImpact(input, timeToElapse) {
  const severeImpact = {
    // the estimated number of currently infected people
    currentlyInfected: computeCurrentlyInfected(50, input.reportedCases)
  };

  // determine and set the estimated number of infected peoples at requested time
  severeImpact.infectionsByRequestedTime = computeInfectionsByRequestedTime(
    severeImpact.currentlyInfected, timeToElapse
  );
  // determine and set the estimated number of severe cases at requested time
  severeImpact.severeCasesByRequestedTime = computeSevereCasesByRequestedTime(15,
    severeImpact.infectionsByRequestedTime);

  // determine the estimated number of hospital Beds available or needed at requested time
  severeImpact.hospitalBedsByRequestedTime = computeHospitalBedsByRequestedTime(35,
    input.totalHospitalBeds, severeImpact.severeCasesByRequestedTime);

  // determine and set the estimated number of infected people who will need ICU at requested time
  severeImpact.casesForICUByRequestedTime = computeCasesForICUByRequestedTime(5,
    severeImpact.infectionsByRequestedTime);

  // determine the estimated number of infected people who will need ventilators at requested time
  severeImpact.casesForVentilatorsByRequestedTime = computeCasesForVentilatorsByRequestedTime(2,
    severeImpact.infectionsByRequestedTime);

  // determine and set the amount of money in dollars money the economy is likely to lose daily
  severeImpact.dollarsInFlight = computeDollarsInFlight(severeImpact.infectionsByRequestedTime,
    input.avgDailyIncomePopulation,
    input.avgDailyIncomeInUSD, timeToElapse);

  return severeImpact;
}

/**
 * entry point of the application
 * @param {Object} data
 *  @returns {Object}
 */
const covid19ImpactEstimator = (data) => {
  const input = data;
  const newTimeToElapse = normaliseTimeToElapseToDays(input.timeToElapse, input.periodType);

  return {
    data: input,
    impact: determineImpact(input, newTimeToElapse),
    severeImpact: determineSevereImpact(input, newTimeToElapse)
  };
};

export default covid19ImpactEstimator;
