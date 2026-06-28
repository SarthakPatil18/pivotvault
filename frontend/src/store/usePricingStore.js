import { create } from 'zustand';

export const usePricingStore = create((set, get) => ({
  // Billing toggle: 'monthly' | 'annual'
  billingPeriod: 'monthly',
  
  // Calculator variables
  userCount: 1500,
  revenuePerUser: 12, // ARPU in USD
  costPerUser: 5,     // COGS/hosting cost per user in USD
  fixedCost: 3000,    // Monthly fixed operational costs in USD
  
  setBillingPeriod: (period) => set({ billingPeriod: period }),
  setUserCount: (count) => set({ userCount: count }),
  setRevenuePerUser: (arpu) => set({ revenuePerUser: arpu }),
  setCostPerUser: (cogs) => set({ costPerUser: cogs }),
  setFixedCost: (fixed) => set({ fixedCost: fixed }),
  
  // Derived state selector/calculations
  getCalculations: () => {
    const { userCount, revenuePerUser, costPerUser, fixedCost } = get();
    const totalMRR = userCount * revenuePerUser;
    const totalCOGS = userCount * costPerUser;
    const totalCost = totalCOGS + fixedCost;
    const grossMargin = totalMRR > 0 ? ((totalMRR - totalCOGS) / totalMRR) * 100 : 0;
    const netProfit = totalMRR - totalCost;
    const breakEvenUsers = Math.ceil(fixedCost / (revenuePerUser - costPerUser > 0 ? revenuePerUser - costPerUser : 1));
    
    return {
      totalMRR,
      totalCost,
      netProfit,
      grossMargin: Math.max(0, grossMargin).toFixed(1),
      breakEvenUsers
    };
  },
  
  // Generate curve data points for Recharts curve chart
  getCurveData: () => {
    const { revenuePerUser, costPerUser, fixedCost } = get();
    const steps = 10;
    const data = [];
    const minUsers = 100;
    const maxUsers = 10000;
    const stepSize = (maxUsers - minUsers) / steps;
    
    for (let i = 0; i <= steps; i++) {
      const u = Math.round(minUsers + i * stepSize);
      const mrr = u * revenuePerUser;
      const cost = u * costPerUser + fixedCost;
      data.push({
        users: u,
        MRR: mrr,
        Cost: cost,
        Profit: mrr - cost
      });
    }
    return data;
  }
}));
