'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { MarketAnalysis, AIServiceResponse } from '@/types/ai';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function MarketAnalysisPage() {
  const [productId, setProductId] = useState('prod-001');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const SAMPLE_PRODUCTS = [
    { id: 'prod-001', name: 'Steel Coils - Grade A' },
    { id: 'prod-002', name: 'Electronics Components' },
  ];

  const handleAnalyze = async () => {
    if (!productId) {
      toast.error('Please select a product');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai/market-analysis?productId=${productId}`);
      const data: AIServiceResponse<MarketAnalysis> = await response.json();

      if (data.success && data.data) {
        setAnalysis(data.data);
        toast.success('Market analysis completed');
      } else {
        setError(data.error || 'Analysis failed');
        toast.error(data.error || 'Analysis failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          📈 Market Analysis
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          AI-powered market intelligence, price analysis, and demand forecasting
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select Product
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {SAMPLE_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing Market...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Analyze Market
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Current Price</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${analysis.currentPrice.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">USD</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Average Price</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${analysis.averagePrice.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">30-day avg</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Volatility</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {analysis.priceVolatility.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Price swings</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Trend</p>
              <div className="flex items-center gap-2 mt-2">
                {analysis.trend === 'uptrend' ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <span className="font-bold text-slate-900 dark:text-white capitalize">
                  {analysis.trend}
                </span>
              </div>
            </div>
          </div>

          {/* Price History Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Price History
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysis.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#0ea5e9"
                  name="Price (USD)"
                  connectNulls
                />
                {analysis.priceHistory.some((p) => p.volume) && (
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#f97316"
                    name="Volume"
                    connectNulls
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Market Share */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Market Share
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(analysis.marketShare).map(([name, value]) => ({
                  name,
                  value,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="value" fill="#0ea5e9" name="Market Share %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Demand & Supply */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Demand Level
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {analysis.demandLevel}
                  </span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                    {analysis.demandLevel}
                  </span>
                </div>
                <div className="bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-full"
                    style={{
                      width: `${
                        analysis.demandLevel === 'very_high'
                          ? 100
                          : analysis.demandLevel === 'high'
                            ? 75
                            : analysis.demandLevel === 'medium'
                              ? 50
                              : 25
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Supply Level
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {analysis.supplyLevel}
                  </span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                    {analysis.supplyLevel}
                  </span>
                </div>
                <div className="bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full"
                    style={{
                      width: `${
                        analysis.supplyLevel === 'high'
                          ? 100
                          : analysis.supplyLevel === 'medium'
                            ? 50
                            : 25
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Price Optimization */}
          <div className="bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-sky-50 dark:to-sky-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">
              💡 Price Optimization Recommendation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">Suggested Price</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                  ${analysis.priceOptimization.suggestedPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">
                  Expected Volume Increase
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                  {analysis.priceOptimization.expectedVolumeIncrease}%
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">Profit Impact</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                  {analysis.priceOptimization.profitImpact > 0 ? '+' : ''}
                  {analysis.priceOptimization.profitImpact}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-200">Analysis Error</p>
            <p className="text-sm text-red-800 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
