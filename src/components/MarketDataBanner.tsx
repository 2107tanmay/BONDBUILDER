import { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { getMarketData } from '../lib/fredApi';

interface MarketData {
  treasuryRate: number;
  corporateSpread: number;
  lastUpdated: string;
}

export default function MarketDataBanner() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const data = await getMarketData();
      setMarketData(data);
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, []);

  if (!marketData) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Live Market Data</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-blue-100">10Y Treasury</p>
              <p className="text-lg font-bold">{marketData.treasuryRate}%</p>
            </div>

            <div>
              <p className="text-xs text-blue-100">Corporate Spread</p>
              <p className="text-lg font-bold">{marketData.corporateSpread}%</p>
            </div>
          </div>
        </div>

        <button
          onClick={loadMarketData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      <p className="text-xs text-blue-100 mt-2">
        Source: FRED (Federal Reserve Economic Data) • Last updated: {new Date(marketData.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
}
