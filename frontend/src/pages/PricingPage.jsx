import React from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle, Sliders, TrendingUp, ShieldAlert, Sparkles, Building } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { usePricingStore } from '../store/usePricingStore';

const PricingPage = () => {
  const {
    billingPeriod,
    userCount,
    revenuePerUser,
    costPerUser,
    fixedCost,
    setBillingPeriod,
    setUserCount,
    setRevenuePerUser,
    setCostPerUser,
    setFixedCost,
    getCalculations,
    getCurveData
  } = usePricingStore();

  const calcs = getCalculations();
  const chartData = getCurveData();

  // Price calculations based on period
  const getPrice = (basePrice) => {
    if (billingPeriod === 'annual') {
      return Math.round(basePrice * 0.8); // 20% discount
    }
    return basePrice;
  };

  // Pricing plans definition
  const plans = [
    {
      name: 'Scout',
      eyebrow: 'FOUNDER SEED',
      price: 0,
      description: 'Essential failure archives and pattern-matching for early-stage validation.',
      features: [
        'Access to core failure archives',
        'Basic search & filters',
        '5 AI Risk Scans per month',
        'Founder Confessions access',
        'Community Forum access'
      ],
      cta: 'Start Free Trial',
      featured: false,
      accent: '#e85d3a'
    },
    {
      name: 'Operator',
      eyebrow: 'GROWTH LAYER',
      price: 49,
      description: 'Comprehensive research, unlimited AI scans, and pitch deck risk audits.',
      features: [
        'Full postmortem database access',
        'Advanced failure pattern matching',
        'Unlimited AI Risk Scans',
        'Pitch Deck Autopsy tool',
        'Interactive AI Investigator Chat',
        'Bookmarks & search history trail'
      ],
      cta: 'Upgrade to Operator',
      featured: true,
      accent: '#3b82f6'
    },
    {
      name: 'Vault',
      eyebrow: 'ENTERPRISE SHIELD',
      price: 199,
      description: 'Custom risk modeling, dedicated AI analysts, and competitor benchmarks.',
      features: [
        'Dedicated AI Risk Model training',
        'Competitor risk benchmarking',
        'Raw data export (CSV/JSON)',
        'Full developer API access',
        'Shared team workspace (5 seats)',
        'Priority diagnostic support'
      ],
      cta: 'Contact Sales',
      featured: false,
      accent: '#e85d3a'
    }
  ];

  // Framer Motion animation configs
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-text-primary py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
      
      {/* Background Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-data text-xs text-[#e85d3a] tracking-[0.25em] font-semibold uppercase mb-3 block">
            STRESS-TEST PLANS
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight mb-4">
            Secure your startup's future.
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Choose the diagnostic shielding you need to analyze market risk, validate unit economics, and avoid critical growth hurdles.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 flex justify-center items-center gap-3">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-text-primary font-semibold' : 'text-text-muted'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-7 rounded-full bg-surface-3 border border-[rgba(255,255,255,0.08)] relative p-1 transition-colors duration-300 focus:outline-none"
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#e85d3a] transition-all duration-300 ${
                  billingPeriod === 'annual' ? 'translate-x-7 bg-[#3b82f6]' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'text-text-primary font-semibold' : 'text-text-muted'}`}>
              Annual
              <span className="text-[10px] font-data font-bold bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 px-1.5 py-0.5 rounded uppercase">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24"
        >
          {plans.map((plan) => {
            const displayPrice = getPrice(plan.price);
            const planBorder = plan.featured 
              ? 'border-[1.5px] border-[#3b82f6]' 
              : 'border border-[rgba(255,255,255,0.08)]';
            
            return (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative backdrop-blur-[12px] bg-[rgba(255,255,255,0.02)] ${planBorder} hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
                style={{ 
                  backgroundColor: '#111118',
                  background: 'linear-gradient(135deg, rgba(17,17,24,0.7) 0%, rgba(10,10,15,0.8) 100%)'
                }}
              >
                {/* Glow Effects */}
                {plan.featured && (
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl -z-10 blur-sm opacity-30" />
                )}

                <div>
                  {/* Eyebrow & Name */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="font-data text-[10px] tracking-wider uppercase font-semibold text-text-muted" style={{ color: plan.accent }}>
                        {plan.eyebrow}
                      </span>
                      <h3 className="text-2xl font-bold font-display mt-1 text-text-primary">{plan.name}</h3>
                    </div>
                    {plan.featured && (
                      <span className="text-[10px] font-data font-bold bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 px-2 py-0.5 rounded-full uppercase">
                        POPULAR
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="font-data text-4xl sm:text-5xl font-extrabold text-text-primary">
                      ${displayPrice}
                    </span>
                    <span className="font-data text-xs text-text-muted">
                      {plan.price === 0 ? '' : `/mo`}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed mb-8">
                    {plan.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-[rgba(255,255,255,0.08)] mb-8" />

                  {/* Feature Checklist */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                        <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.accent }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call To Action */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 cursor-pointer ${
                    plan.featured
                      ? 'bg-[#3b82f6] text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20'
                      : 'bg-surface-2 border border-[rgba(255,255,255,0.08)] text-text-primary hover:bg-surface-3 hover:border-[rgba(255,255,255,0.15)]'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive Unit Economics Calculator */}
        <section className="rounded-2xl border border-[rgba(255,255,255,0.08)] p-8 md:p-10 relative overflow-hidden" style={{ backgroundColor: '#111118' }}>
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-[rgba(255,255,255,0.08)]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="w-4 h-4 text-[#e85d3a]" />
                <span className="font-data text-xs text-[#e85d3a] tracking-[0.25em] font-semibold uppercase">
                  SIMULATION ENGINE
                </span>
              </div>
              <h2 className="text-2xl font-bold font-display text-text-primary">
                Interactive Unit Economics Calculator
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Premature scaling and toxic unit economics sink 38% of startups. Model your growth curves below.
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.08)] px-4 py-2.5 rounded-lg shrink-0">
              <ShieldAlert className="w-4 h-4 text-warning" />
              <span className="text-xs text-text-secondary">
                Break-Even Point: <strong className="font-data text-text-primary">{calcs.breakEvenUsers.toLocaleString()} users</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sliders Configuration */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* User Count Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    Active Users
                  </span>
                  <span className="font-data text-text-primary font-bold">
                    {userCount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={userCount}
                  onChange={(e) => setUserCount(Number(e.target.value))}
                  className="w-full accent-[#e85d3a] bg-surface-3 rounded-lg h-2"
                />
              </div>

              {/* Revenue/User Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-secondary uppercase tracking-wider">
                    ARPU (Avg Revenue/User)
                  </span>
                  <span className="font-data text-text-primary font-bold">
                    ${revenuePerUser}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={revenuePerUser}
                  onChange={(e) => setRevenuePerUser(Number(e.target.value))}
                  className="w-full accent-[#e85d3a] bg-surface-3 rounded-lg h-2"
                />
              </div>

              {/* Cost/User Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-secondary uppercase tracking-wider">
                    COGS / User (Hosting/CAC)
                  </span>
                  <span className="font-data text-text-primary font-bold">
                    ${costPerUser}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={costPerUser}
                  onChange={(e) => setCostPerUser(Number(e.target.value))}
                  className="w-full accent-[#e85d3a] bg-surface-3 rounded-lg h-2"
                />
              </div>

              {/* Fixed operational costs Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-secondary uppercase tracking-wider">
                    Fixed Operational Costs
                  </span>
                  <span className="font-data text-text-primary font-bold">
                    ${fixedCost.toLocaleString()}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="250"
                  value={fixedCost}
                  onChange={(e) => setFixedCost(Number(e.target.value))}
                  className="w-full accent-[#e85d3a] bg-surface-3 rounded-lg h-2"
                />
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <div className="bg-[#0a0a0f] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">
                    Gross Margin
                  </span>
                  <span className="font-data text-lg font-bold text-text-primary">
                    {calcs.grossMargin}%
                  </span>
                </div>
                
                <div className="bg-[#0a0a0f] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">
                    Monthly Profit
                  </span>
                  <span className={`font-data text-lg font-bold ${calcs.netProfit >= 0 ? 'text-[#3b82f6]' : 'text-[#e85d3a]'}`}>
                    {calcs.netProfit >= 0 ? '+' : ''}${calcs.netProfit.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

            {/* Recharts Curve Visualization */}
            <div className="lg:col-span-8 bg-[#0a0a0f] rounded-xl border border-[rgba(255,255,255,0.08)] p-6 h-[380px] flex flex-col justify-between">
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                  MRR vs Operational Cost Curves
                </span>
                
                <div className="flex gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[#3b82f6]">
                    <span className="w-2.5 h-2.5 rounded bg-[#3b82f6]" /> MRR
                  </span>
                  <span className="flex items-center gap-1.5 text-[#e85d3a]">
                    <span className="w-2.5 h-2.5 rounded bg-[#e85d3a]" /> Cost
                  </span>
                </div>
              </div>

              <div className="flex-1 min-h-0 w-full font-data">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e85d3a" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#e85d3a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    
                    <XAxis 
                      dataKey="users" 
                      tick={{ fill: '#94A3B8', fontSize: 10 }}
                      axisLine={false}
                    />
                    
                    <YAxis 
                      tick={{ fill: '#94A3B8', fontSize: 10 }} 
                      axisLine={false}
                      tickFormatter={(v) => `$${v.toLocaleString()}`}
                    />
                    
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#111118', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        borderRadius: '8px',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px'
                      }}
                      formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                      labelFormatter={(label) => `Scale: ${label.toLocaleString()} users`}
                    />
                    
                    <Area 
                      type="monotone" 
                      dataKey="MRR" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorMRR)" 
                    />
                    
                    <Area 
                      type="monotone" 
                      dataKey="Cost" 
                      stroke="#e85d3a" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorCost)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
};

export default PricingPage;
