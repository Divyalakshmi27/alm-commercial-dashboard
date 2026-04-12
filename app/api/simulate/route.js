import { NextResponse } from 'next/server';
import { calculateScenario, generateOptimizationCurve } from '@/lib/simEngine';

export async function POST(request) {
  const params = await request.json();

  const { baseCost, currentPrice, newPrice, promoIntensity, competitorPrice, month } = params;

  if (
    baseCost === undefined || currentPrice === undefined || newPrice === undefined ||
    promoIntensity === undefined || competitorPrice === undefined || month === undefined
  ) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const currentScenario = calculateScenario(params);
  const curveData = generateOptimizationCurve(params);

  // Baseline: 0% promo at base price
  const baselineScenario = calculateScenario({ ...params, newPrice: params.currentPrice, promoIntensity: 0 });

  // Promo curve: scan 0–50% promo intensity
  const promoCurveData = [];
  for (let p = 0; p <= 50; p += 5) {
    const pRes = calculateScenario({ ...params, promoIntensity: p });
    promoCurveData.push({
      promo: p,
      profit: Math.round(pRes.profit),
      revenue: Math.round(pRes.revenue),
      margin: Number(((params.currentPrice - pRes.effectiveCost) / params.currentPrice * 100).toFixed(1))
    });
  }

  // Heatmap: 5×5 grid around current price & competitor price
  const heatmapData = [];
  const pStep = params.currentPrice * 0.05;
  const cStep = params.competitorPrice * 0.05;
  for (let c = -2; c <= 2; c++) {
    const testComp = Math.max(0.1, params.competitorPrice + c * cStep);
    for (let pLine = -2; pLine <= 2; pLine++) {
      const testPrice = Math.max(0.1, params.currentPrice + pLine * pStep);
      const hRes = calculateScenario({ ...params, newPrice: testPrice, competitorPrice: testComp });
      heatmapData.push({
        ourPrice: Number(testPrice.toFixed(2)),
        compPrice: Number(testComp.toFixed(2)),
        profit: Math.round(hRes.profit),
        demand: Math.round(hRes.demand)
      });
    }
  }

  return NextResponse.json({ currentScenario, curveData, baselineScenario, promoCurveData, heatmapData });
}
