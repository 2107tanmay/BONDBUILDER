/*
  # BondBuilder Database Schema

  ## Overview
  Creates the database schema for the BondBuilder corporate bond design simulator.
  This schema stores user bond simulations with their input parameters and AI-generated predictions.

  ## New Tables

  ### `bond_simulations`
  Stores each bond design simulation with inputs and outputs
  - `id` (uuid, primary key) - Unique identifier for each simulation
  - `user_id` (uuid, foreign key to auth.users) - User who created the simulation
  - `created_at` (timestamptz) - When the simulation was created
  
  #### Input Fields
  - `company_name` (text) - Name of the company issuing the bond
  - `revenue` (numeric) - Annual revenue in millions
  - `profit_margin` (numeric) - Profit margin as percentage
  - `debt_to_ebitda` (numeric) - Debt to EBITDA ratio
  - `industry` (text) - Industry sector (e.g., Tech, Healthcare, Finance)
  - `target_raise` (numeric) - Target amount to raise in millions
  - `market_rate` (numeric) - Current market interest rate as percentage
  
  #### Output Fields
  - `credit_rating` (text) - Predicted credit rating (e.g., AAA, BBB, BB)
  - `coupon_rate` (numeric) - Predicted coupon rate as percentage
  - `maturity_years` (integer) - Predicted maturity in years
  - `maturity_category` (text) - Short/Medium/Long term
  - `issue_price` (text) - Par, Premium, or Discount
  - `covenants` (text) - Recommended bond covenants
  - `risk_level` (text) - Overall risk assessment (Low/Medium/High)

  ## Security
  - Enable RLS on `bond_simulations` table
  - Users can only read their own simulations
  - Users can only insert simulations for themselves
  - Users can delete their own simulations

  ## Notes
  - All monetary values stored in millions for consistency
  - Percentages stored as decimals (e.g., 6.8 for 6.8%)
  - Foreign key constraint ensures data integrity with auth.users
*/

CREATE TABLE IF NOT EXISTS bond_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  
  company_name text NOT NULL,
  revenue numeric NOT NULL,
  profit_margin numeric NOT NULL,
  debt_to_ebitda numeric NOT NULL,
  industry text NOT NULL,
  target_raise numeric NOT NULL,
  market_rate numeric NOT NULL,
  
  credit_rating text NOT NULL,
  coupon_rate numeric NOT NULL,
  maturity_years integer NOT NULL,
  maturity_category text NOT NULL,
  issue_price text NOT NULL,
  covenants text NOT NULL,
  risk_level text NOT NULL
);

ALTER TABLE bond_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own simulations"
  ON bond_simulations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations"
  ON bond_simulations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations"
  ON bond_simulations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS bond_simulations_user_id_idx ON bond_simulations(user_id);
CREATE INDEX IF NOT EXISTS bond_simulations_created_at_idx ON bond_simulations(created_at DESC);