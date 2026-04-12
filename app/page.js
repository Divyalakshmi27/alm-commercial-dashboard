'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, Database, Lock } from 'lucide-react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceDot, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Legend
} from 'recharts';

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
const formatNumber = (val) => new Intl.NumberFormat('en-US').format(val);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Price: $${Number(label).toFixed(2)}`}</p>
        <div className="tooltip-item">
          <span style={{ color: 'var(--accent-cyan)' }}>Profit:</span>
          <span>{formatCurrency(payload[0].value)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTooltipPromo = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Promo: ${Number(label)}%`}</p>
        <div className="tooltip-item">
          <span style={{ color: 'var(--accent-purple)' }}>Profit:</span>
          <span>{formatCurrency(payload[0].value)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const seasonalityMap = {
  0: { label: 'January',   type: 'Off-Season',   multiplier: 0.8 },
  1: { label: 'February',  type: 'Off-Season',   multiplier: 0.8 },
  2: { label: 'March',     type: 'Regular',      multiplier: 0.9 },
  3: { label: 'April',     type: 'Regular',      multiplier: 1.0 },
  4: { label: 'May',       type: 'Regular',      multiplier: 1.0 },
  5: { label: 'June',      type: 'Peak Season',  multiplier: 1.1 },
  6: { label: 'July',      type: 'Peak Season',  multiplier: 1.2 },
  7: { label: 'August',    type: 'Peak Season',  multiplier: 1.2 },
  8: { label: 'September', type: 'Regular',      multiplier: 1.0 },
  9: { label: 'October',   type: 'Regular',      multiplier: 1.0 },
  10: { label: 'November', type: 'Peak Season',  multiplier: 1.3 },
  11: { label: 'December', type: 'Peak Season',  multiplier: 1.4 },
};

const businessGoalsList = ['Max Profit', 'Max Revenue', 'Target Margin (40%)', 'Market Share Growth'];

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [loginError, setLoginError]   = useState('');

  const [categories, setCategories]           = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct]   = useState('');

  const [initialPrice, setInitialPrice]       = useState(10.0);
  const [baseCost, setBaseCost]               = useState(6.0);
  const [newPrice, setNewPrice]               = useState(10.0);
  const [promoIntensity, setPromoIntensity]   = useState(10);
  const [competitorPrice, setCompetitorPrice] = useState(9.5);
  const [month, setMonth]                     = useState(5);
  const [businessGoal, setBusinessGoal]       = useState('Max Profit');

  const [simulationData, setSimulationData] = useState({
    currentScenario: null,
    curveData: { data: [], optimalPoint: null, globalOptimalPoint: null },
    baselineScenario: null,
    promoCurveData: [],
    heatmapData: [],
  });
  const [loading, setLoading] = useState(true);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'basis@nestle.com' && password === 'nimos_admin@2026') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  // Fetch product catalog after login
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchCatalog = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          const firstCat = Object.keys(data)[0];
          setSelectedCategory(firstCat);
          if (data[firstCat]?.length > 0) {
            setSelectedProduct(data[firstCat][0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };
    fetchCatalog();
  }, [isLoggedIn]);

  // Update parameters when product changes
  useEffect(() => {
    if (!categories || !categories[selectedCategory]) return;
    const product = categories[selectedCategory].find(p => p.id === selectedProduct);
    if (product) {
      setInitialPrice(product.initialPrice);
      setBaseCost(product.baseCost);
      setNewPrice(product.initialPrice);
      setCompetitorPrice(product.competitorPrice);
      setPromoIntensity(10);
    }
  }, [selectedProduct, selectedCategory, categories]);

  // Debounced simulation fetch
  useEffect(() => {
    if (!isLoggedIn || !selectedProduct) return;
    const fetchSimulation = async () => {
      setLoading(true);
      try {
        const payload = {
          productId: selectedProduct,
          baseCost,
          currentPrice: initialPrice,
          newPrice,
          promoIntensity,
          competitorPrice,
          month,
          businessGoal,
        };
        const response = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const data = await response.json();
          setSimulationData(data);
        }
      } catch (err) {
        console.error('Simulation failed', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSimulation, 150);
    return () => clearTimeout(debounceTimer);
  }, [newPrice, promoIntensity, competitorPrice, month, baseCost, selectedProduct, initialPrice, businessGoal, isLoggedIn]);

  const { currentScenario, curveData, baselineScenario, promoCurveData, heatmapData } = simulationData;
  const currentSeason = seasonalityMap[month];

  // Radar chart data
  const radarData = React.useMemo(() => {
    if (!currentScenario || !curveData) return [];
    const opt = curveData.globalOptimalPoint;
    const maxDemand = Math.max(...(curveData.data.length ? curveData.data.map(d => d.demand) : [1]));

    const currentMarginScore  = Math.min(100, Math.max(0, currentScenario.marginPercent));
    const currentVolumeScore  = Math.min(100, Math.max(0, maxDemand > 0 ? (currentScenario.demand / maxDemand) * 100 : 0));
    const priceGap            = Math.abs(newPrice - competitorPrice) / Math.max(0.01, competitorPrice) * 100;
    const currentCompScore    = Math.min(100, Math.max(0, 100 - priceGap));
    const currentBrandScore   = Math.min(100, Math.max(0, 100 - promoIntensity * 2));
    const currentSafetyScore  = Math.min(100, Math.max(0, 100 - currentScenario.riskScore));

    let optMarginScore  = currentMarginScore;
    let optVolumeScore  = currentVolumeScore;
    let optCompScore    = currentCompScore;
    let optBrandScore   = currentBrandScore;
    let optSafetyScore  = currentSafetyScore;

    if (opt) {
      optMarginScore  = Math.min(100, Math.max(0, opt.marginPercent));
      optVolumeScore  = Math.min(100, Math.max(0, maxDemand > 0 ? (opt.demand / maxDemand) * 100 : 0));
      const optPriceGap = Math.abs(opt.price - competitorPrice) / Math.max(0.01, competitorPrice) * 100;
      optCompScore    = Math.min(100, Math.max(0, 100 - optPriceGap));
      optBrandScore   = Math.min(100, Math.max(0, 100 - opt.promoIntensity * 2));
      optSafetyScore  = Math.min(100, Math.max(0, 100 - opt.riskScore));
    }

    return [
      { subject: 'Margin',     optimal: optMarginScore,  current: currentMarginScore },
      { subject: 'Volume',     optimal: optVolumeScore,  current: currentVolumeScore },
      { subject: 'Competitor', optimal: optCompScore,    current: currentCompScore },
      { subject: 'Brand',      optimal: optBrandScore,   current: currentBrandScore },
      { subject: 'Safety',     optimal: optSafetyScore,  current: currentSafetyScore },
    ];
  }, [currentScenario, curveData, newPrice, competitorPrice, promoIntensity]);

  // Bar chart comparison data
  const comparisonData = React.useMemo(() => {
    if (!baselineScenario || !currentScenario) return [];
    const data = [
      { name: 'Baseline (No Promo)', Profit: baselineScenario.profit, Revenue: baselineScenario.revenue },
      { name: 'Your Scenario',       Profit: currentScenario.profit,  Revenue: currentScenario.revenue },
    ];
    if (curveData.globalOptimalPoint) {
      data.push({ name: 'AI Optimal', Profit: curveData.globalOptimalPoint.profit, Revenue: curveData.globalOptimalPoint.revenue });
    }
    return data;
  }, [baselineScenario, currentScenario, curveData.globalOptimalPoint]);

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setSelectedCategory(newCat);
    if (categories[newCat]?.length > 0) {
      setSelectedProduct(categories[newCat][0].id);
    }
  };

  const sliderMaxPrice = Math.max(20, initialPrice * 2.5).toFixed(1);
  const sliderMinPrice = Math.min(initialPrice * 0.2, baseCost).toFixed(1);

  // Profit / revenue deltas
  let profitDelta = 0, revenueDelta = 0, profitMultiplier = null, revenueMultiplier = null;
  if (currentScenario && baselineScenario) {
    const baseProfit  = baselineScenario.profit  || 1;
    const baseRevenue = baselineScenario.revenue || 1;
    profitDelta       = ((currentScenario.profit  - baselineScenario.profit)  / Math.abs(baseProfit))  * 100;
    revenueDelta      = ((currentScenario.revenue - baselineScenario.revenue) / Math.abs(baseRevenue)) * 100;
    profitMultiplier  = currentScenario.profit  / baseProfit;
    revenueMultiplier = currentScenario.revenue / baseRevenue;
  }

  const formatDeltaLabel = (delta, multiplier) => {
    const sign = delta > 0 ? '+' : '';
    if (Math.abs(delta) > 200) return `${multiplier?.toFixed(1)}x ${delta > 0 ? 'increase' : 'decrease'}`;
    const cappedDisplay = Math.abs(delta) > 100
      ? `${delta > 0 ? '+' : '-'}100%+`
      : `${sign}${delta.toFixed(1)}%`;
    return cappedDisplay;
  };

  let optProfitDelta = 0, optRevenueDelta = 0, optMarginDelta = 0;
  if (currentScenario && curveData.globalOptimalPoint) {
    optProfitDelta  = ((curveData.globalOptimalPoint.profit  - currentScenario.profit)  / (currentScenario.profit  || 1)) * 100;
    optRevenueDelta = ((curveData.globalOptimalPoint.revenue - currentScenario.revenue) / (currentScenario.revenue || 1)) * 100;
    const currentMargin = currentScenario.marginPercent;
    const optMargin     = ((curveData.globalOptimalPoint.price - curveData.globalOptimalPoint.effectiveCost) / curveData.globalOptimalPoint.price) * 100;
    optMarginDelta      = optMargin - currentMargin;
  }

  // ─── LOGIN SCREEN ────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="brand" style={{ color: 'var(--text-main)', marginBottom: '40px', fontSize: '2rem' }}>
          <div className="brand-icon" style={{ width: '48px', height: '48px' }}>
            <Activity size={28} color="white" />
          </div>
          <div>NIMOS</div>
        </div>
        <div className="login-box">
          <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Enterprise Login</h2>
          <form onSubmit={handleLogin}>
            <input
              id="login-email"
              type="text"
              placeholder="Email Address"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="login-password"
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '16px' }}>{loginError}</p>}
            <button id="login-submit" type="submit" className="login-button">
              Sign In <Lock size={16} style={{ display: 'inline', marginLeft: '8px', verticalAlign: 'text-bottom' }} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
  return (
    <div className="app-container">

      {/* ── LEFT SIDEBAR ───────────────────────────────────────────────────── */}
      <div className="sidebar glass-panel" style={{ overflowY: 'auto' }}>
        <div className="brand" style={{ color: 'var(--text-main)' }}>
          <div className="brand-icon"><Activity size={20} color="white" /></div>
          <div>NIMOS</div>
        </div>

        <div className="glass-panel-header" style={{ marginBottom: '16px' }}>
          <h3>Portfolio</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select an asset to model.</p>
        </div>

        {/* Category / Product selectors */}
        <div className="slider-container" style={{ marginBottom: '16px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', padding: '12px', borderRadius: '8px' }}>
          <div className="slider-header" style={{ marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-main)' }}>Category</span>
          </div>
          <select
            id="select-category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', textTransform: 'capitalize' }}
          >
            {categories && Object.keys(categories).map(catKey => (
              <option key={catKey} value={catKey}>{catKey.replace(/_/g, ' ')}</option>
            ))}
          </select>

          <div className="slider-header" style={{ marginBottom: '8px', marginTop: '12px' }}>
            <span style={{ color: 'var(--text-main)' }}>Product</span>
          </div>
          <select
            id="select-product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--panel-border)' }}
          >
            {categories && categories[selectedCategory]?.map(prod => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </select>
        </div>

        {/* Optimization target */}
        <div className="glass-panel-header" style={{ marginTop: '24px' }}>
          <h3>Optimization Target</h3>
        </div>
        <div className="slider-container">
          <select
            id="select-goal"
            value={businessGoal}
            onChange={(e) => setBusinessGoal(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '2px solid var(--accent-blue)', fontWeight: 'bold' }}
          >
            {businessGoalsList.map(goal => (
              <option key={goal} value={goal}>{goal}</option>
            ))}
          </select>
        </div>

        <div className="glass-panel-header">
          <h3>Scenario Parameters</h3>
        </div>

        {/* Planning month */}
        <div className="slider-container" style={{ marginBottom: '24px' }}>
          <div className="slider-header" style={{ marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-main)' }}>Planning Month</span>
            <span style={{
              fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px',
              background: currentSeason.multiplier > 1.0 ? 'rgba(5,150,105,0.1)' : currentSeason.multiplier < 1.0 ? 'rgba(220,38,38,0.1)' : 'rgba(15,17,21,0.05)',
              color: currentSeason.multiplier > 1.0 ? 'var(--success)' : currentSeason.multiplier < 1.0 ? 'var(--danger)' : 'var(--text-muted)',
            }}>
              {currentSeason.type}
            </span>
          </div>
          <select
            id="select-month"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--panel-border)' }}
          >
            {Object.entries(seasonalityMap).map(([key, data]) => (
              <option key={key} value={key}>{data.label}</option>
            ))}
          </select>
        </div>

        {/* COGS */}
        <div className="slider-container">
          <div className="slider-header">
            <span style={{ color: 'var(--text-main)' }}>Cost to Make (COGS, $)</span>
            <input
              id="input-cogs"
              type="number"
              value={baseCost}
              onChange={(e) => setBaseCost(parseFloat(e.target.value) || 0)}
              step="0.01"
              style={{ width: '60px', padding: '2px 4px', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', borderRadius: '4px', textAlign: 'right' }}
            />
          </div>
        </div>

        {/* Our Price slider */}
        <div className="slider-container">
          <div className="slider-header">
            <span style={{ color: 'var(--text-main)' }}>Our Price ($)</span>
            <input
              id="input-price"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
              step="0.01"
              style={{ width: '60px', padding: '2px 4px', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', borderRadius: '4px', textAlign: 'right' }}
            />
          </div>
          <input id="slider-price" type="range" min={sliderMinPrice} max={sliderMaxPrice} step="0.01" value={newPrice} onChange={(e) => setNewPrice(parseFloat(e.target.value))} />
        </div>

        {/* Promo intensity slider */}
        <div className="slider-container">
          <div className="slider-header">
            <span style={{ color: 'var(--text-main)' }}>Promotion Intensity (%)</span>
            <input
              id="input-promo"
              type="number"
              value={promoIntensity}
              onChange={(e) => setPromoIntensity(parseFloat(e.target.value) || 0)}
              step="1"
              style={{ width: '60px', padding: '2px 4px', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', borderRadius: '4px', textAlign: 'right' }}
            />
          </div>
          <input id="slider-promo" type="range" min="0" max="50" step="1" value={promoIntensity} onChange={(e) => setPromoIntensity(parseFloat(e.target.value))} />
        </div>

        {/* Competitor price slider */}
        <div className="slider-container">
          <div className="slider-header">
            <span style={{ color: 'var(--text-main)' }}>Competitor Price ($)</span>
            <input
              id="input-comp-price"
              type="number"
              value={competitorPrice}
              onChange={(e) => setCompetitorPrice(parseFloat(e.target.value) || 0)}
              step="0.01"
              style={{ width: '60px', padding: '2px 4px', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', borderRadius: '4px', textAlign: 'right' }}
            />
          </div>
          <input id="slider-comp-price" type="range" min={sliderMinPrice} max={sliderMaxPrice} step="0.01" value={competitorPrice} onChange={(e) => setCompetitorPrice(parseFloat(e.target.value))} />
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button
            id="btn-logout"
            onClick={() => setIsLoggedIn(false)}
            style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '6px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div className="main-content">
        <div className="glass-panel">
          <div className="glass-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Revenue Optimiser</h2>
            <div className="badge-sap">
              <Database size={12} /> Demand Input from SAP IBP
            </div>
          </div>

          {!currentScenario ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>Connecting to simulation engine…</div>
          ) : (
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-title">Predicted Demand</span>
                <span className="metric-value">{formatNumber(currentScenario.demand)} units</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Expected Revenue</span>
                <span className="metric-value">{formatCurrency(currentScenario.revenue)}</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Gross Profit</span>
                <span className={`metric-value ${currentScenario.profit < 0 ? 'negative' : 'positive'}`}>
                  {formatCurrency(currentScenario.profit)}
                </span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Unit Margin</span>
                <span className={`metric-value ${currentScenario.unitMargin <= 0 ? 'negative' : ''}`}>
                  {formatCurrency(currentScenario.unitMargin)}
                  <span style={{ fontSize: '1rem', marginLeft: '8px', color: 'var(--text-muted)' }}>
                    ({Number(currentScenario.marginPercent).toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── CHARTS ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexGrow: 1 }}>

          {/* Profit & Demand vs Price */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="glass-panel-header">
              <h3>Profit &amp; Demand vs. Price</h3>
            </div>
            <div className="chart-container" style={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={curveData.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis dataKey="price" stroke="var(--text-muted)" tickFormatter={(val) => `$${val}`} />
                  <YAxis yAxisId="left" stroke="var(--text-muted)" tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area yAxisId="left" type="monotone" dataKey="profit" stroke="var(--accent-cyan)" strokeWidth={3} fillOpacity={0.1} fill="var(--accent-cyan)" />
                  {curveData.optimalPoint && (
                    <ReferenceDot yAxisId="left" x={curveData.optimalPoint.price} y={curveData.optimalPoint.profit} r={6} fill="var(--success)" stroke="white" strokeWidth={2} />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit vs Promo Intensity */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="glass-panel-header">
              <h3>Profit vs. Promotion Intensity</h3>
            </div>
            <div className="chart-container" style={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={promoCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis dataKey="promo" stroke="var(--text-muted)" tickFormatter={(val) => `${val}%`} />
                  <YAxis yAxisId="left" stroke="var(--text-muted)" tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltipPromo />} />
                  <Line yAxisId="left" type="monotone" dataKey="profit" stroke="var(--accent-purple)" strokeWidth={3} dot={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scenario Comparison */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="glass-panel-header">
              <h3>Scenario Comparison Array</h3>
            </div>
            <div className="chart-container" style={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--panel-border)' }} />
                  <Legend />
                  <Bar dataKey="Profit"  fill="var(--success)"      radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Revenue" fill="var(--accent-blue)"  radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competitive Heatmap */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="glass-panel-header">
              <h3>Competitive Heatmap (Profit)</h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>X: Our Price | Y: Competitor Price</p>
            </div>
            <div className="heatmap-grid" style={{ flexGrow: 1, marginTop: '8px' }}>
              {(() => {
                const profits = heatmapData.map(c => c.profit);
                const minP = Math.min(...profits);
                const maxP = Math.max(...profits);
                const range = maxP - minP || 1;

                return heatmapData.map((cell, idx) => {
                  const ratio = (cell.profit - minP) / range;
                  let bg;
                  if (cell.profit < 0)    bg = '#ef4444';
                  else if (ratio < 0.25)  bg = '#fca5a5';
                  else if (ratio < 0.5)   bg = '#fde68a';
                  else if (ratio < 0.75)  bg = '#86efac';
                  else                    bg = '#15803d';

                  const textColor = ratio >= 0.75 || cell.profit < 0 ? 'white' : '#1a1a1a';
                  const isCurrent = Math.abs(cell.ourPrice - newPrice) < 0.05 && Math.abs(cell.compPrice - competitorPrice) < 0.05;

                  return (
                    <div
                      key={idx}
                      className="heatmap-cell"
                      style={{ backgroundColor: bg, color: textColor, border: isCurrent ? '3px solid #1d4ed8' : '1px solid rgba(0,0,0,0.1)', boxShadow: isCurrent ? '0 0 8px rgba(29,78,216,0.5)' : 'none' }}
                    >
                      <span style={{ fontSize: '0.65rem' }}>O: ${cell.ourPrice}</span>
                      <span style={{ fontSize: '0.65rem' }}>C: ${cell.compPrice}</span>
                      <strong>${(cell.profit / 1000).toFixed(1)}k</strong>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

        </div>
      </div>

      {/* ── RIGHT INSIGHTS PANEL ───────────────────────────────────────────── */}
      <div className="insights-panel glass-panel">
        <div className="glass-panel-header">
          <h2>Executive Insights</h2>
        </div>

        {currentScenario ? (
          <>
            {/* Peak season warning */}
            {currentSeason.multiplier >= 1.2 && promoIntensity > 15 && (
              <div style={{ background: '#fef2f2', border: '1px solid var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: 'var(--danger)', fontSize: '0.9rem', display: 'flex', gap: '8px' }}>
                <AlertTriangle size={20} />
                <span style={{ fontWeight: '600' }}>Warning: High promotions in peak season may cause unnecessary margin loss.</span>
              </div>
            )}

            {/* What Changed */}
            {(() => {
              const profitLabel  = formatDeltaLabel(profitDelta, profitMultiplier);
              const revenueLabel = formatDeltaLabel(revenueDelta, revenueMultiplier);
              const isLargeRevenueDelta = Math.abs(revenueDelta) > 100;
              const isLargeProfitDelta  = Math.abs(profitDelta)  > 100;

              let profitContext  = 'due to pricing/promo strategy.';
              if (currentScenario.marginPercent < 15) profitContext = 'driven by thin margins from aggressive pricing.';
              else if (promoIntensity > 30)            profitContext = 'as heavy promotions eroded per-unit margin.';
              else if (newPrice > competitorPrice * 1.15) profitContext = 'due to premium pricing above the market.';
              else if (newPrice < competitorPrice * 0.9)  profitContext = 'due to underpricing vs. the competitive benchmark.';

              let revenueContext = 'from volume × price dynamics.';
              if (isLargeRevenueDelta && revenueDelta > 0) revenueContext = 'due to strong volume uplift from promotions (note: high baseline was low).';
              if (promoIntensity > 20 && revenueDelta > 0) revenueContext = 'boosted by high promotion lifting demand volume.';

              return (
                <div style={{ background: 'var(--bg-dark)', padding: '14px', borderRadius: '8px', border: '1px solid var(--panel-border)', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What Changed?</h4>
                  <ul style={{ fontSize: '0.88rem', color: 'var(--text-main)', paddingLeft: '18px', lineHeight: '1.8', margin: 0 }}>
                    <li>
                      {profitDelta > 0 ? 'Profit increased' : 'Profit declined'} by{' '}
                      <strong style={{ color: profitDelta > 0 ? 'var(--success)' : 'var(--danger)' }}>{profitLabel}</strong>{' '}
                      {isLargeProfitDelta && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(raw: {profitDelta > 0 ? '+' : ''}{profitDelta.toFixed(0)}%)</span>}{' '}
                      {profitContext}
                    </li>
                    <li>
                      Revenue {revenueDelta > 0 ? 'grew' : 'contracted'} by{' '}
                      <strong style={{ color: revenueDelta > 0 ? 'var(--accent-blue)' : 'var(--danger)' }}>{revenueLabel}</strong>{' '}
                      {isLargeRevenueDelta && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(raw: {revenueDelta.toFixed(0)}%)</span>}{' '}
                      {revenueContext}
                    </li>
                    <li>
                      Unit margin is{' '}
                      <strong style={{ color: currentScenario.marginPercent < 15 ? 'var(--danger)' : currentScenario.marginPercent > 35 ? 'var(--success)' : 'var(--warning)' }}>
                        {currentScenario.marginPercent.toFixed(1)}%
                      </strong>
                      {currentScenario.marginPercent < 15 && ' — critically thin, consider raising price.'}
                      {currentScenario.marginPercent > 35 && ' — healthy margin band.'}
                    </li>
                  </ul>
                </div>
              );
            })()}

            <div className="decision-box" style={{ marginTop: '0' }}>
              <div className="decision-title">
                <TrendingUp size={20} />
                {currentScenario.recommendation}
              </div>
              <div className="decision-text">{currentScenario.rationale}</div>
            </div>

            {/* Strategic Radar */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Strategic Radar</h3>
              {radarData.length > 0 && (
                <div style={{ width: '100%', height: '220px', position: 'relative', marginTop: '-10px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="var(--panel-border)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Optimal Baseline"  dataKey="optimal" stroke="var(--accent-purple)" fill="var(--accent-purple)" fillOpacity={0.1} strokeDasharray="3 3" />
                      <Radar name="Current Strategy"  dataKey="current" stroke="var(--accent-cyan)"   fill="var(--accent-cyan)"   fillOpacity={0.4} />
                      <Tooltip contentStyle={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Optimization Engine */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(5,150,105,0.05)', borderRadius: '12px', border: '1px solid rgba(5,150,105,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--success)', fontWeight: '600' }}>
                  <Zap size={18} /> Optimization Engine
                </div>
                <span style={{ fontSize: '0.75rem', background: 'var(--success)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {businessGoal}
                </span>
              </div>

              {curveData.globalOptimalPoint ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '12px' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Target Price</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>${curveData.globalOptimalPoint.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Target Promo</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{curveData.globalOptimalPoint.promoIntensity}%</div>
                    </div>
                  </div>

                  <div style={{ background: 'white', padding: '10px', borderRadius: '8px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Delta vs Current Strategy:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: optProfitDelta > 0 ? 'var(--success)' : 'var(--danger)' }}>
                        <strong>Profit:</strong> {optProfitDelta > 0 ? '+' : ''}{optProfitDelta.toFixed(1)}%
                      </span>
                      <span>|</span>
                      <span style={{ color: optRevenueDelta > 0 ? 'var(--success)' : 'var(--danger)' }}>
                        <strong>Revenue:</strong> {optRevenueDelta > 0 ? '+' : ''}{optRevenueDelta.toFixed(1)}%
                      </span>
                      <span>|</span>
                      <span style={{ color: optMarginDelta > 0 ? 'var(--success)' : 'var(--danger)' }}>
                        <strong>Margin:</strong> {optMarginDelta > 0 ? '+' : ''}{optMarginDelta.toFixed(1)}% pts
                      </span>
                    </div>
                  </div>

                  <button
                    id="btn-apply-optimal"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--success)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => {
                      setNewPrice(curveData.globalOptimalPoint.price);
                      setPromoIntensity(curveData.globalOptimalPoint.promoIntensity);
                    }}
                  >
                    Apply Optimal Strategy
                  </button>
                </>
              ) : null}
            </div>
          </>
        ) : (
          <div>Waiting for simulation engine…</div>
        )}
      </div>

    </div>
  );
}
