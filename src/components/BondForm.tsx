import { useState } from 'react';
import { BondInputs } from '../lib/supabase';
import { Building2, DollarSign, TrendingUp, Activity, Briefcase, Target, Percent } from 'lucide-react';

interface BondFormProps {
  onSubmit: (inputs: BondInputs) => Promise<void>;
  loading: boolean;
}

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Energy',
  'Telecommunications',
  'Real Estate',
  'Consumer Goods',
  'Transportation'
];

export default function BondForm({ onSubmit, loading }: BondFormProps) {
  const [inputs, setInputs] = useState<BondInputs>({
    company_name: '',
    revenue: 0,
    profit_margin: 0,
    debt_to_ebitda: 0,
    industry: 'Technology',
    target_raise: 0,
    market_rate: 4.0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(inputs);
  };

  const updateField = (field: keyof BondInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Bond Parameters</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Company Name
            </div>
          </label>
          <input
            type="text"
            value={inputs.company_name}
            onChange={(e) => updateField('company_name', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            placeholder="Acme Corporation"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Annual Revenue (Millions)
              </div>
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.revenue || ''}
              onChange={(e) => updateField('revenue', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              placeholder="1200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Profit Margin (%)
              </div>
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.profit_margin || ''}
              onChange={(e) => updateField('profit_margin', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              placeholder="18.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Debt/EBITDA Ratio
              </div>
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.debt_to_ebitda || ''}
              onChange={(e) => updateField('debt_to_ebitda', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              placeholder="3.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Industry
              </div>
            </label>
            <select
              value={inputs.industry}
              onChange={(e) => updateField('industry', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-white"
              required
            >
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Target Raise (Millions)
              </div>
            </label>
            <input
              type="number"
              step="0.01"
              value={inputs.target_raise || ''}
              onChange={(e) => updateField('target_raise', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              placeholder="200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Market Rate (%)
              </div>
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.market_rate || ''}
              onChange={(e) => updateField('market_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              placeholder="4.0"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Generate Bond Design'}
        </button>
      </div>
    </form>
  );
}
