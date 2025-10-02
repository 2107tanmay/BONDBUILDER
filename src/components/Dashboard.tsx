import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, BondSimulation, BondInputs } from '../lib/supabase';
import { predictBondDesign } from '../lib/bondEngine';
import BondForm from './BondForm';
import BondResults from './BondResults';
import SimulationHistory from './SimulationHistory';
import MarketDataBanner from './MarketDataBanner';
import { LogOut, Plus, History } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [simulations, setSimulations] = useState<BondSimulation[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<BondSimulation | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'form' | 'history'>('form');

  useEffect(() => {
    loadSimulations();
  }, [user]);

  const loadSimulations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bond_simulations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading simulations:', error);
    } else {
      setSimulations(data || []);
    }
  };

  const handleSubmit = async (inputs: BondInputs) => {
    if (!user) return;

    setLoading(true);
    try {
      const prediction = predictBondDesign(inputs);

      const { data, error } = await supabase
        .from('bond_simulations')
        .insert([
          {
            user_id: user.id,
            ...inputs,
            ...prediction
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setSelectedSimulation(data);
      await loadSimulations();
      setView('history');
    } catch (error) {
      console.error('Error creating simulation:', error);
      alert('Failed to create simulation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this simulation?')) return;

    const { error } = await supabase
      .from('bond_simulations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting simulation:', error);
    } else {
      if (selectedSimulation?.id === id) {
        setSelectedSimulation(null);
      }
      await loadSimulations();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">BondBuilder</h1>
                <p className="text-xs text-slate-600">Corporate Bond Design Simulator</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MarketDataBanner />

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView('form')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'form'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-5 h-5" />
            New Simulation
          </button>

          <button
            onClick={() => setView('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'history'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <History className="w-5 h-5" />
            History ({simulations.length})
          </button>
        </div>

        {view === 'form' ? (
          <BondForm onSubmit={handleSubmit} loading={loading} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SimulationHistory
                simulations={simulations}
                onSelect={setSelectedSimulation}
                onDelete={handleDelete}
                selectedId={selectedSimulation?.id}
              />
            </div>

            <div className="lg:col-span-2">
              {selectedSimulation ? (
                <BondResults simulation={selectedSimulation} />
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Select a Simulation
                  </h3>
                  <p className="text-slate-500">
                    Choose a simulation from the history to view its details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
