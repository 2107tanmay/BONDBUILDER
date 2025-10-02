const FRED_API_KEY = 'd6eb6b6f802eb6c31d404ee046c9537c';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

interface FredSeriesObservation {
  date: string;
  value: string;
}

interface MarketData {
  treasuryRate: number;
  corporateSpread: number;
  lastUpdated: string;
}

export async function fetchTreasuryRate(): Promise<number> {
  try {
    const response = await fetch(
      `${FRED_BASE_URL}/series/observations?series_id=DGS10&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch treasury rate');
    }

    const data = await response.json();
    const observations: FredSeriesObservation[] = data.observations;

    if (observations && observations.length > 0) {
      const value = parseFloat(observations[0].value);
      return isNaN(value) ? 4.0 : value;
    }

    return 4.0;
  } catch (error) {
    console.error('Error fetching treasury rate:', error);
    return 4.0;
  }
}

export async function fetchCorporateSpread(): Promise<number> {
  try {
    const response = await fetch(
      `${FRED_BASE_URL}/series/observations?series_id=BAMLC0A0CM&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch corporate spread');
    }

    const data = await response.json();
    const observations: FredSeriesObservation[] = data.observations;

    if (observations && observations.length > 0) {
      const value = parseFloat(observations[0].value);
      return isNaN(value) ? 2.5 : value;
    }

    return 2.5;
  } catch (error) {
    console.error('Error fetching corporate spread:', error);
    return 2.5;
  }
}

export async function getMarketData(): Promise<MarketData> {
  const [treasuryRate, corporateSpread] = await Promise.all([
    fetchTreasuryRate(),
    fetchCorporateSpread()
  ]);

  return {
    treasuryRate: Math.round(treasuryRate * 100) / 100,
    corporateSpread: Math.round(corporateSpread * 100) / 100,
    lastUpdated: new Date().toISOString()
  };
}
