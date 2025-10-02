import { BondInputs } from './supabase';

interface BondPrediction {
  credit_rating: string;
  coupon_rate: number;
  maturity_years: number;
  maturity_category: string;
  issue_price: string;
  covenants: string;
  risk_level: string;
}

function calculateCreditScore(inputs: BondInputs): number {
  let score = 100;

  if (inputs.debt_to_ebitda > 5) score -= 30;
  else if (inputs.debt_to_ebitda > 4) score -= 20;
  else if (inputs.debt_to_ebitda > 3) score -= 10;
  else if (inputs.debt_to_ebitda > 2) score -= 5;

  if (inputs.profit_margin < 5) score -= 25;
  else if (inputs.profit_margin < 10) score -= 15;
  else if (inputs.profit_margin < 15) score -= 5;
  else if (inputs.profit_margin > 25) score += 10;

  if (inputs.revenue < 100) score -= 15;
  else if (inputs.revenue < 500) score -= 5;
  else if (inputs.revenue > 5000) score += 10;

  const leverageRatio = inputs.target_raise / inputs.revenue;
  if (leverageRatio > 0.5) score -= 20;
  else if (leverageRatio > 0.3) score -= 10;
  else if (leverageRatio > 0.2) score -= 5;

  const stableIndustries = ['Healthcare', 'Consumer Goods', 'Finance'];
  const volatileIndustries = ['Technology', 'Energy', 'Retail'];

  if (stableIndustries.includes(inputs.industry)) score += 5;
  if (volatileIndustries.includes(inputs.industry)) score -= 5;

  return Math.max(0, Math.min(100, score));
}

function getCreditRating(score: number): string {
  if (score >= 90) return 'AAA';
  if (score >= 85) return 'AA+';
  if (score >= 80) return 'AA';
  if (score >= 75) return 'AA-';
  if (score >= 70) return 'A+';
  if (score >= 65) return 'A';
  if (score >= 60) return 'A-';
  if (score >= 55) return 'BBB+';
  if (score >= 50) return 'BBB';
  if (score >= 45) return 'BBB-';
  if (score >= 40) return 'BB+';
  if (score >= 35) return 'BB';
  if (score >= 30) return 'BB-';
  if (score >= 25) return 'B+';
  if (score >= 20) return 'B';
  if (score >= 15) return 'B-';
  if (score >= 10) return 'CCC+';
  return 'CCC';
}

function calculateCouponRate(inputs: BondInputs, creditRating: string): number {
  const baseRate = inputs.market_rate;

  const ratingSpread: { [key: string]: number } = {
    'AAA': 0.5, 'AA+': 0.7, 'AA': 0.9, 'AA-': 1.1,
    'A+': 1.3, 'A': 1.5, 'A-': 1.8,
    'BBB+': 2.1, 'BBB': 2.5, 'BBB-': 3.0,
    'BB+': 3.5, 'BB': 4.0, 'BB-': 4.5,
    'B+': 5.0, 'B': 5.5, 'B-': 6.0,
    'CCC+': 7.0, 'CCC': 8.0
  };

  let spread = ratingSpread[creditRating] || 5.0;

  if (inputs.debt_to_ebitda > 4) spread += 0.5;
  if (inputs.profit_margin < 10) spread += 0.3;

  const couponRate = baseRate + spread;
  return Math.round(couponRate * 10) / 10;
}

function determineMaturity(inputs: BondInputs, creditRating: string): { years: number; category: string } {
  const score = calculateCreditScore(inputs);

  if (score >= 70) {
    return { years: 10, category: 'Long-term' };
  } else if (score >= 50) {
    return { years: 7, category: 'Medium-term' };
  } else {
    return { years: 5, category: 'Short-term' };
  }
}

function determineIssuePrice(couponRate: number, marketRate: number): string {
  const difference = couponRate - marketRate;

  if (Math.abs(difference) < 0.5) return 'Par';
  if (difference > 0.5) return 'Premium';
  return 'Discount';
}

function generateCovenants(inputs: BondInputs, creditRating: string): string {
  const covenants: string[] = [];

  if (inputs.debt_to_ebitda > 3) {
    covenants.push(`Maintain Debt/EBITDA below ${(inputs.debt_to_ebitda * 1.2).toFixed(1)}x`);
  }

  if (inputs.profit_margin < 15) {
    covenants.push('Minimum interest coverage ratio of 2.5x');
  }

  if (creditRating.startsWith('BB') || creditRating.startsWith('B') || creditRating.startsWith('CCC')) {
    covenants.push('Limit dividends if leverage exceeds 4.5x');
    covenants.push('Restrict additional debt without lender consent');
  }

  covenants.push('Quarterly financial reporting required');

  if (inputs.target_raise / inputs.revenue > 0.3) {
    covenants.push('Maintain minimum liquidity of $50M');
  }

  return covenants.join('; ');
}

function determineRiskLevel(creditRating: string, debtToEbitda: number): string {
  const investmentGrade = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-'];

  if (investmentGrade.includes(creditRating) && debtToEbitda < 3) {
    return 'Low';
  } else if (investmentGrade.includes(creditRating) || debtToEbitda < 4) {
    return 'Medium';
  } else {
    return 'High';
  }
}

export function predictBondDesign(inputs: BondInputs): BondPrediction {
  const creditScore = calculateCreditScore(inputs);
  const credit_rating = getCreditRating(creditScore);
  const coupon_rate = calculateCouponRate(inputs, credit_rating);
  const maturity = determineMaturity(inputs, credit_rating);
  const issue_price = determineIssuePrice(coupon_rate, inputs.market_rate);
  const covenants = generateCovenants(inputs, credit_rating);
  const risk_level = determineRiskLevel(credit_rating, inputs.debt_to_ebitda);

  return {
    credit_rating,
    coupon_rate,
    maturity_years: maturity.years,
    maturity_category: maturity.category,
    issue_price,
    covenants,
    risk_level
  };
}
