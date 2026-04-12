export const nestleProducts = {
    coffee: [
        { id: 'nescafe_gold', name: 'Nescafé Gold', category: 'Coffee', baseCost: 5.00, initialPrice: 12.00, competitorPrice: 11.00, baseDemand: 8000, elasticity: -2.0, promoLiftMultiplier: 2.0 },
        { id: 'nespresso_original', name: 'Nespresso OriginalLine', category: 'Coffee', baseCost: 0.30, initialPrice: 0.80, competitorPrice: 0.75, baseDemand: 100000, elasticity: -1.2, promoLiftMultiplier: 1.5 },
        { id: 'nescafe_clasico', name: 'Nescafé Clásico', category: 'Coffee', baseCost: 2.50, initialPrice: 6.00, competitorPrice: 5.50, baseDemand: 25000, elasticity: -1.5, promoLiftMultiplier: 1.8 }
    ],
    confectionery: [
        { id: 'kitkat', name: 'KitKat', category: 'Confectionery', baseCost: 0.30, initialPrice: 1.50, competitorPrice: 1.40, baseDemand: 40000, elasticity: -2.5, promoLiftMultiplier: 3.0 },
        { id: 'smarties', name: 'Smarties', category: 'Confectionery', baseCost: 0.40, initialPrice: 1.20, competitorPrice: 1.20, baseDemand: 25000, elasticity: -2.0, promoLiftMultiplier: 2.5 },
        { id: 'aero', name: 'Aero', category: 'Confectionery', baseCost: 0.35, initialPrice: 1.30, competitorPrice: 1.25, baseDemand: 20000, elasticity: -2.2, promoLiftMultiplier: 2.8 },
        { id: 'milkybar', name: 'Milkybar', category: 'Confectionery', baseCost: 0.50, initialPrice: 1.50, competitorPrice: 1.40, baseDemand: 15000, elasticity: -2.1, promoLiftMultiplier: 2.4 }
    ],
    culinary: [
        { id: 'maggi_noodles', name: 'Maggi Noodles', category: 'Culinary', baseCost: 0.50, initialPrice: 1.00, competitorPrice: 0.90, baseDemand: 50000, elasticity: -0.5, promoLiftMultiplier: 1.2 },
        { id: 'maggi_bouillon', name: 'Maggi Bouillon Cubes', category: 'Culinary', baseCost: 1.00, initialPrice: 2.50, competitorPrice: 2.30, baseDemand: 30000, elasticity: -0.6, promoLiftMultiplier: 1.1 },
        { id: 'buitoni_pasta', name: 'Buitoni Pasta', category: 'Culinary', baseCost: 2.00, initialPrice: 3.50, competitorPrice: 3.20, baseDemand: 15000, elasticity: -1.5, promoLiftMultiplier: 1.5 },
        { id: 'thomy_mayonnaise', name: 'Thomy Mayonnaise', category: 'Culinary', baseCost: 1.50, initialPrice: 3.20, competitorPrice: 3.00, baseDemand: 12000, elasticity: -1.3, promoLiftMultiplier: 1.4 }
    ],
    water: [
        { id: 'perrier', name: 'Perrier', category: 'Water', baseCost: 0.60, initialPrice: 2.00, competitorPrice: 1.80, baseDemand: 20000, elasticity: -1.8, promoLiftMultiplier: 2.2 },
        { id: 'san_pellegrino', name: 'San Pellegrino', category: 'Water', baseCost: 0.70, initialPrice: 2.20, competitorPrice: 2.00, baseDemand: 18000, elasticity: -1.7, promoLiftMultiplier: 2.0 },
        { id: 'nestle_pure_life', name: 'Nestlé Pure Life', category: 'Water', baseCost: 0.20, initialPrice: 0.80, competitorPrice: 0.70, baseDemand: 60000, elasticity: -2.5, promoLiftMultiplier: 2.8 }
    ],
    petcare: [
        { id: 'purina_pro_plan', name: 'Purina Pro Plan', category: 'Petcare', baseCost: 15.00, initialPrice: 35.00, competitorPrice: 32.00, baseDemand: 5000, elasticity: -0.8, promoLiftMultiplier: 1.1 },
        { id: 'friskies', name: 'Friskies', category: 'Petcare', baseCost: 4.00, initialPrice: 8.50, competitorPrice: 8.00, baseDemand: 20000, elasticity: -1.4, promoLiftMultiplier: 1.8 },
        { id: 'felix', name: 'Felix', category: 'Petcare', baseCost: 5.00, initialPrice: 10.00, competitorPrice: 9.50, baseDemand: 18000, elasticity: -1.3, promoLiftMultiplier: 1.6 }
    ],
    frozen_food: [
        { id: 'lean_cuisine', name: 'Lean Cuisine', category: 'Frozen Food', baseCost: 1.50, initialPrice: 3.50, competitorPrice: 3.20, baseDemand: 25000, elasticity: -1.6, promoLiftMultiplier: 1.9 },
        { id: 'stouffers', name: "Stouffer's", category: 'Frozen Food', baseCost: 1.80, initialPrice: 4.00, competitorPrice: 3.80, baseDemand: 30000, elasticity: -1.5, promoLiftMultiplier: 1.7 },
        { id: 'hot_pockets', name: 'Hot Pockets', category: 'Frozen Food', baseCost: 1.20, initialPrice: 2.80, competitorPrice: 2.50, baseDemand: 40000, elasticity: -2.0, promoLiftMultiplier: 2.5 }
    ],
    nutrition_and_dairy: [
        { id: 'milo', name: 'Milo', category: 'Nutrition & Dairy', baseCost: 3.00, initialPrice: 6.50, competitorPrice: 6.00, baseDemand: 20000, elasticity: -1.0, promoLiftMultiplier: 1.5 },
        { id: 'nesquik', name: 'Nesquik', category: 'Nutrition & Dairy', baseCost: 2.00, initialPrice: 4.50, competitorPrice: 4.20, baseDemand: 22000, elasticity: -1.3, promoLiftMultiplier: 1.7 },
        { id: 'nido', name: 'Nido', category: 'Nutrition & Dairy', baseCost: 8.00, initialPrice: 16.00, competitorPrice: 15.00, baseDemand: 12000, elasticity: -0.9, promoLiftMultiplier: 1.2 },
        { id: 'carnation', name: 'Carnation', category: 'Nutrition & Dairy', baseCost: 1.20, initialPrice: 2.50, competitorPrice: 2.20, baseDemand: 15000, elasticity: -0.8, promoLiftMultiplier: 1.1 },
        { id: 'coffee_mate', name: 'Coffee mate', category: 'Nutrition & Dairy', baseCost: 2.50, initialPrice: 5.00, competitorPrice: 4.50, baseDemand: 28000, elasticity: -1.5, promoLiftMultiplier: 1.8 }
    ]
};

export const getProductById = (id) => {
    for (const category in nestleProducts) {
        const prod = nestleProducts[category].find(p => p.id === id);
        if (prod) return prod;
    }
    return null;
};

export const calculateScenario = ({
    productId, baseCost, currentPrice, newPrice, promoIntensity,
    competitorPrice, month = 5, macroEnv = 'Stable', promoType = 'Standard', portfolioPriceB = 0
}) => {
    const product = getProductById(productId) || { baseDemand: 10000, elasticity: -1.5, promoLiftMultiplier: 1.5 };
    const baseDemand = product.baseDemand;

    const seasonalityMap = {
        0: 0.8, 1: 0.8, 2: 0.9, 3: 1.0, 4: 1.0, 5: 1.1,
        6: 1.2, 7: 1.2, 8: 1.0, 9: 1.0, 10: 1.3, 11: 1.4
    };
    const seasonality = seasonalityMap[month] || 1.0;

    let elasticity = product.elasticity;
    if (macroEnv === 'Recession') elasticity = product.elasticity - 1.0;
    if (macroEnv === 'Boom') elasticity = product.elasticity + 0.7;

    const consumerPrice = newPrice * (1 - (promoIntensity / 100));
    const priceRatio = consumerPrice / currentPrice;

    let demand = baseDemand * seasonality * Math.pow(priceRatio, elasticity);

    let seasonalPromoStrength = 1.0;
    if (seasonality >= 1.2) seasonalPromoStrength = 0.15;
    else if (seasonality <= 0.9) seasonalPromoStrength = 2.5;

    const promoIntensityFactor = promoIntensity > 0 ? Math.sqrt(promoIntensity / 100) : 0;

    let promoLift = 1;
    let effectiveCost = baseCost;
    let brandHealthPenalty = promoIntensity * 2;

    if (promoType === 'BOGO') {
        promoLift = 1 + promoIntensityFactor * (product.promoLiftMultiplier * 2) * seasonalPromoStrength;
        effectiveCost = baseCost + (newPrice * (promoIntensity / 100) * 0.8);
        brandHealthPenalty = promoIntensity * 3;
    } else if (promoType === 'Loyalty') {
        promoLift = 1 + promoIntensityFactor * (product.promoLiftMultiplier * 0.5) * seasonalPromoStrength;
        effectiveCost = baseCost + (newPrice * (promoIntensity / 100) * 0.2);
        brandHealthPenalty = promoIntensity * 0.5;
    } else {
        promoLift = 1 + promoIntensityFactor * product.promoLiftMultiplier * seasonalPromoStrength;
        effectiveCost = baseCost + (newPrice * (promoIntensity / 100));
    }

    demand = demand * promoLift;
    const compRatio = competitorPrice / consumerPrice;
    const compEffect = Math.pow(compRatio, 1.4);
    demand = Math.round(demand * compEffect);
    demand = Math.max(demand, 0);

    const revenue = newPrice * demand;
    const profit = (newPrice - effectiveCost) * demand;

    let riskScore = 0;
    if (consumerPrice > competitorPrice * 1.1) riskScore += 40;

    let portfolioCannibalization = 0;
    if (portfolioPriceB > 0 && consumerPrice < portfolioPriceB * 0.9) {
        portfolioCannibalization = Math.min(100, (portfolioPriceB - consumerPrice) / portfolioPriceB * 100);
        riskScore += portfolioCannibalization;
    }

    let recommendation = 'Balanced Growth Strategy';
    let rationale = 'This configuration creates a healthy equilibrium between market volume and unit margins.';

    if (seasonality > 1.0 && promoIntensity > 10) {
        riskScore += 40;
        recommendation = 'Cannibalizing Natural High Demand';
        rationale = 'Promoting during a peak seasonal surge sacrifices pure margin. The psychological lift of a sale right now is extremely low.';
    } else if (seasonality < 1.0 && promoIntensity > 15) {
        recommendation = 'Aggressive Off-Season Volume Move';
        rationale = 'Strategic discounting to clear inventory and stimulate sales when organic foot traffic is very low.';
    }

    if (promoIntensity >= 40) {
        riskScore += 50;
        rationale += ' Severe Brand Dilution occurring due to terminal discounting.';
    } else if (promoIntensity >= 25) {
        riskScore += 25;
    }

    if (profit < 0) riskScore = 100;

    if (profit <= 0) {
        recommendation = 'Loss Making Parameters';
        rationale = 'Your cost and discount structuring is inverted. Action required to prevent severe P&L damage.';
    } else if (consumerPrice >= competitorPrice * 1.5 && promoIntensity < 10) {
        recommendation = 'Premium Isolation Strategy';
        rationale = 'Extracting high margins from inelastic cohorts, though volume output will be significantly degraded.';
    } else if (consumerPrice > competitorPrice && promoIntensity < 5) {
        recommendation = 'Premium Skimming Strategy';
        rationale = 'Pricing above standard benchmarks, capturing brand equity while protecting margins.';
    } else if (consumerPrice < competitorPrice * 0.9 && promoIntensity > 15) {
        recommendation = 'Market Share Siege';
        rationale = 'Intense discounting combined with a low base price designed to aggressively destabilize competition.';
    }

    if (consumerPrice > competitorPrice * 1.2) {
        rationale += ' WARNING: Street price is vastly higher than competitors, exposing you to severe churn.';
    }

    return {
        demand,
        revenue,
        profit,
        effectiveCost,
        unitMargin: newPrice - effectiveCost,
        marginPercent: ((newPrice - effectiveCost) / newPrice) * 100,
        riskScore: Math.min(Math.round(riskScore), 100),
        brandHealthPenalty,
        portfolioCannibalization,
        recommendation,
        rationale
    };
};

export const generateOptimizationCurve = (params) => {
    const { currentPrice, baseCost, newPrice, competitorPrice, month, businessGoal } = params;

    const anchorPrice = Math.max(currentPrice, newPrice, competitorPrice, baseCost);
    const minPrice = Math.max(baseCost * 1.01, anchorPrice * 0.3);
    const maxPrice = Math.max(anchorPrice * 1.5, minPrice + 1);

    const steps = 40;
    const stepSize = (maxPrice - minPrice) / steps;

    const data = [];
    let optimalPoint = null;
    let maxProfit = -Infinity;

    for (let i = 0; i <= steps; i++) {
        const testPrice = minPrice + i * stepSize;
        const res = calculateScenario({ ...params, newPrice: testPrice });

        data.push({
            price: Number(testPrice.toFixed(2)),
            profit: Math.round(res.profit),
            demand: Math.round(res.demand),
            revenue: Math.round(res.revenue)
        });

        if (res.profit > maxProfit) {
            maxProfit = res.profit;
            optimalPoint = { ...res, price: Number(testPrice.toFixed(2)), promoIntensity: params.promoIntensity };
        }
    }

    const seasonalityMap = {
        0: 0.8, 1: 0.8, 2: 0.9, 3: 1.0, 4: 1.0, 5: 1.1,
        6: 1.2, 7: 1.2, 8: 1.0, 9: 1.0, 10: 1.3, 11: 1.4
    };
    const currentSeas = seasonalityMap[month !== undefined ? month : 5] || 1.0;

    let maxAllowedPromo = 50;
    if (currentSeas >= 1.2) maxAllowedPromo = 5;
    else if (currentSeas >= 1.0) maxAllowedPromo = 20;
    else maxAllowedPromo = 35;

    const goal = businessGoal || 'Max Profit';
    let globalOptimalPoint = null;
    let globalMaxObjectiveValue = -Infinity;

    for (let paramPromo = 0; paramPromo <= maxAllowedPromo; paramPromo += 5) {
        for (let i = 0; i <= steps; i++) {
            const testPrice = minPrice + i * stepSize;
            const res2 = calculateScenario({ ...params, newPrice: testPrice, promoIntensity: paramPromo });

            const riskPenaltyFactor = Math.max(0.1, 1 - (res2.riskScore / 150));
            let objectiveValue = -Infinity;

            if (res2.profit >= 0) {
                if (goal === 'Max Profit') {
                    objectiveValue = res2.profit * riskPenaltyFactor;
                } else if (goal === 'Max Revenue') {
                    objectiveValue = res2.revenue * riskPenaltyFactor;
                } else if (goal === 'Market Share Growth') {
                    objectiveValue = res2.demand * riskPenaltyFactor;
                } else if (goal === 'Target Margin (40%)') {
                    const marginTarget = 0.40;
                    const actMargin = (testPrice - res2.effectiveCost) / testPrice;
                    const penalty = Math.abs(actMargin - marginTarget) * 10;
                    objectiveValue = res2.profit * (1 / (1 + penalty)) * riskPenaltyFactor;
                }
            }

            if (objectiveValue > globalMaxObjectiveValue) {
                globalMaxObjectiveValue = objectiveValue;
                globalOptimalPoint = { ...res2, price: Number(testPrice.toFixed(2)), promoIntensity: paramPromo };
            }
        }
    }

    return { data, optimalPoint, globalOptimalPoint };
};
