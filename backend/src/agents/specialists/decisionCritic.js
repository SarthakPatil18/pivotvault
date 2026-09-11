export async function run({ founderClaims = [], specialistFindings, evidence = [] }) {
  const warnings = [];
  for (const claim of founderClaims) warnings.push(`Validate this founder assumption with a measurable test: ${claim}`);
  if (!evidence.length) warnings.push('The decision has little corroborating evidence; obtain customer and market evidence before committing capital.');
  if (specialistFindings.market?.findings?.saturationScore >= 50) warnings.push('Market evidence suggests meaningful saturation; define a quantified acquisition advantage.');
  if (specialistFindings.historical?.findings?.historicalRiskSignal >= 0.5) warnings.push('Comparable historical failures need explicit countermeasures before launch.');
  while (warnings.length < 3) warnings.push('Define a falsifiable milestone and stop condition before the next investment decision.');
  return { warnings: warnings.slice(0, 8), attackedAssumptions: founderClaims, blindspots: evidence.length ? [] : ['Evidence coverage is incomplete.'] };
}
