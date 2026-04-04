const runTriggers = async (worker, claimDescription) => {
  const logs = [];
  let firedCount = 0;

  // Trigger 1: Weather Trigger (Mock Random Data)
  const isExtremeWeather = Math.random() > 0.3; // 70% chance of extreme weather in demo
  logs.push({
    trigger_name: 'Weather Data API',
    result: isExtremeWeather,
    detail: isExtremeWeather ? 'Rainfall > 50mm detected in district' : 'Normal weather conditions'
  });
  if (isExtremeWeather) firedCount++;

  // Trigger 2: Flood Zone Check (hardcoded list check from worker.zone)
  const isFloodZone = ['high', 'flood_prone'].includes(worker.zone.toLowerCase());
  logs.push({
    trigger_name: 'Flood Zone Check',
    result: isFloodZone,
    detail: isFloodZone ? 'Location verified in high-risk zone' : 'Location is not a designated flood zone'
  });
  if (isFloodZone) firedCount++;

  // Trigger 3: Accident Registry (60% true for risky jobs, 10% otherwise)
  const riskyJobs = ['construction', 'factory', 'manufacturing', 'mining'];
  const isRisky = riskyJobs.includes(worker.occupation.toLowerCase());
  const accidentFound = isRisky ? Math.random() > 0.4 : Math.random() > 0.9;
  logs.push({
    trigger_name: 'Accident Registry API',
    result: accidentFound,
    detail: accidentFound ? 'Matching local hospital admission record found' : 'No local hospital admission found'
  });
  if (accidentFound) firedCount++;

  // Trigger 4: Income Gap Trigger (Mock - active if claim requests > 1 week income)
  // Assuming claim_amount parsing (simulated by checking if it contains 'income' or 'lost' in description)
  const isIncomeGap = claimDescription.toLowerCase().includes('income') || claimDescription.toLowerCase().includes('wage');
  logs.push({
    trigger_name: 'Income Gap Analysis',
    result: isIncomeGap,
    detail: isIncomeGap ? 'Significant wage loss pattern detected for worker group' : 'Not applicable or no pattern found'
  });
  if (isIncomeGap) firedCount++;

  // Trigger 5: Government Disruption Trigger (Mock monsoon logic - Jun to Sep, true)
  const currentMonth = new Date().getMonth() + 1;
  const isMonsoon = currentMonth >= 6 && currentMonth <= 9;
  const govtDisruption = isMonsoon || Math.random() > 0.8;
  logs.push({
    trigger_name: 'Government Disruption Notice',
    result: govtDisruption,
    detail: govtDisruption ? 'Official work halt / curfew declared in district' : 'No official curfew or halt declared'
  });
  if (govtDisruption) firedCount++;

  console.log(`[ML Oracle] Automation ran on claim for Worker ${worker.id}. Fired triggers: ${firedCount}/5`);

  return { logs, firedCount };
};

module.exports = { runTriggers };
