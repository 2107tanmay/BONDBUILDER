import { BondSimulation } from '../lib/supabase';
import { Award, TrendingUp, Calendar, DollarSign, Shield, AlertTriangle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface BondResultsProps {
  simulation: BondSimulation;
}

const COLORS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#ef4444'
};

export default function BondResults({ simulation }: BondResultsProps) {
  const ratingData = [
    { name: 'AAA', value: simulation.credit_rating === 'AAA' ? 100 : 10 },
    { name: 'AA', value: simulation.credit_rating.startsWith('AA') ? 100 : 10 },
    { name: 'A', value: simulation.credit_rating.startsWith('A') && !simulation.credit_rating.startsWith('AA') ? 100 : 10 },
    { name: 'BBB', value: simulation.credit_rating.startsWith('BBB') ? 100 : 10 },
    { name: 'BB', value: simulation.credit_rating.startsWith('BB') ? 100 : 10 },
    { name: 'B', value: simulation.credit_rating.startsWith('B') && !simulation.credit_rating.startsWith('BB') ? 100 : 10 },
    { name: 'CCC', value: simulation.credit_rating.startsWith('CCC') ? 100 : 10 }
  ];

  const financialData = [
    { name: 'Revenue', value: simulation.revenue },
    { name: 'Target Raise', value: simulation.target_raise }
  ];

  const riskColor = COLORS[simulation.risk_level as keyof typeof COLORS] || COLORS.Medium;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">{simulation.company_name}</h2>
        <p className="text-slate-300 text-lg">Bond Design Results</p>
        <p className="text-slate-400 text-sm mt-2">
          Generated on {new Date(simulation.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-slate-900">
          <div className="flex items-center justify-between mb-3">
            <Award className="w-8 h-8 text-slate-900" />
            <span className="text-3xl font-bold text-slate-900">{simulation.credit_rating}</span>
          </div>
          <p className="text-slate-600 font-medium">Credit Rating</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <span className="text-3xl font-bold text-slate-900">{simulation.coupon_rate}%</span>
          </div>
          <p className="text-slate-600 font-medium">Coupon Rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-slate-900">{simulation.maturity_years}y</span>
          </div>
          <p className="text-slate-600 font-medium">{simulation.maturity_category}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: riskColor }}>
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8" style={{ color: riskColor }} />
            <span className="text-3xl font-bold text-slate-900">{simulation.risk_level}</span>
          </div>
          <p className="text-slate-600 font-medium">Risk Level</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Issue Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Issue Price</span>
              <span className="text-slate-900 font-bold text-lg">{simulation.issue_price}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Industry</span>
              <span className="text-slate-900 font-bold">{simulation.industry}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Revenue</span>
              <span className="text-slate-900 font-bold">${simulation.revenue}M</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Profit Margin</span>
              <span className="text-slate-900 font-bold">{simulation.profit_margin}%</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-600 font-medium">Debt/EBITDA</span>
              <span className="text-slate-900 font-bold">{simulation.debt_to_ebitda}x</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Bond Covenants
          </h3>
          <div className="bg-slate-50 rounded-lg p-4">
            <ul className="space-y-3">
              {simulation.covenants.split(';').map((covenant, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm">{covenant.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Credit Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ratingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#10b981', '#34d399', '#60a5fa', '#fbbf24', '#fb923c', '#f87171', '#dc2626'][index % 7]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Financial Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-amber-900 mb-2">Educational Use Only</h4>
            <p className="text-amber-800 text-sm">
              This is a simulated bond design for educational purposes. Not intended for actual securities issuance.
              Consult with financial advisors and legal counsel for real bond offerings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
