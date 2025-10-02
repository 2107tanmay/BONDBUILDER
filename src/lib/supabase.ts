import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BondSimulation {
  id: string;
  user_id: string;
  created_at: string;
  company_name: string;
  revenue: number;
  profit_margin: number;
  debt_to_ebitda: number;
  industry: string;
  target_raise: number;
  market_rate: number;
  credit_rating: string;
  coupon_rate: number;
  maturity_years: number;
  maturity_category: string;
  issue_price: string;
  covenants: string;
  risk_level: string;
}

export interface BondInputs {
  company_name: string;
  revenue: number;
  profit_margin: number;
  debt_to_ebitda: number;
  industry: string;
  target_raise: number;
  market_rate: number;
}
