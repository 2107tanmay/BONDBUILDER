import { BondSimulation } from '../lib/supabase';
import { Calendar, Building2, TrendingUp, Award, Trash2 } from 'lucide-react';

interface SimulationHistoryProps {
  simulations: BondSimulation[];
  onSelect: (simulation: BondSimulation) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export default function SimulationHistory({ simulations, onSelect, onDelete, selectedId }: SimulationHistoryProps) {
  if (simulations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Simulations Yet</h3>
        <p className="text-slate-500">Create your first bond design to see it here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Simulation History</h2>

      <div className="space-y-3">
        {simulations.map((sim) => (
          <div
            key={sim.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedId === sim.id
                ? 'border-slate-900 bg-slate-50'
                : 'border-slate-200 hover:border-slate-400'
            }`}
            onClick={() => onSelect(sim)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  <h3 className="font-bold text-slate-900 truncate">{sim.company_name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">
                      <span className="font-semibold text-slate-900">{sim.credit_rating}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">
                      <span className="font-semibold text-slate-900">{sim.coupon_rate}%</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">
                      <span className="font-semibold text-slate-900">{sim.maturity_years}y</span> {sim.maturity_category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sim.risk_level === 'Low' ? 'bg-green-100 text-green-800' :
                      sim.risk_level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sim.risk_level} Risk
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {new Date(sim.created_at).toLocaleDateString()} at {new Date(sim.created_at).toLocaleTimeString()}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(sim.id);
                }}
                className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete simulation"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
