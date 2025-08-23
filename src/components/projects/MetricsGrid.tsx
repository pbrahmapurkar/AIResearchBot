'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Smile, TrendingUp, Globe2 } from 'lucide-react';

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

interface PriceSensitivityData {
  elasticityIndex: number;
  mentionShare: number;
  trend: Array<{ name: string; value: number }>;
}

interface RegionalSignalsData {
  total: number;
  regions: Record<string, number>;
}

interface MetricsData {
  sentiment: SentimentData;
  priceSensitivity: PriceSensitivityData;
  regionalSignals: RegionalSignalsData;
}

const SentimentDonut = ({ data }: { data: Array<{ name: string; value: number }> }) => {
  const COLORS = ['#10B981', '#9CA3AF', '#EF4444']; // Green, Gray, Red

  return (
    <ResponsiveContainer width="100%" height={100}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={40}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const MiniBarChart = ({ data }: { data: Array<{ name: string; value: number }> }) => {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const MetricsGrid = ({ metrics }: { metrics: MetricsData }) => {
  const { sentiment, priceSensitivity, regionalSignals } = metrics;

  const sentimentData = [
    { name: 'Positive', value: sentiment.positive },
    { name: 'Neutral', value: sentiment.neutral },
    { name: 'Negative', value: sentiment.negative }
  ];

  const regionalData = Object.entries(regionalSignals.regions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
      {/* Sentiment Analysis Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="flex items-center text-sm font-semibold text-slate-600">
              <Smile className="mr-1 h-4 w-4" /> Sentiment Analysis
            </h3>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {sentiment.positive}% <span className="text-sm font-normal text-green-600">Positive</span>
            </p>
          </div>
          <SentimentDonut data={sentimentData} />
        </div>
        <div className="mt-3 flex text-xs text-slate-500">
          <span className="flex items-center mr-4">
            <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div> 
            Pos: {sentiment.positive}%
          </span>
          <span className="flex items-center mr-4">
            <div className="mr-1 h-3 w-3 rounded-full bg-gray-400"></div> 
            Neu: {sentiment.neutral}%
          </span>
          <span className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-full bg-red-500"></div> 
            Neg: {sentiment.negative}%
          </span>
        </div>
      </div>

      {/* Price Sensitivity Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div>
          <h3 className="flex items-center text-sm font-semibold text-slate-600">
            <TrendingUp className="mr-1 h-4 w-4" /> Price Sensitivity
          </h3>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {priceSensitivity.elasticityIndex}
            <span className="ml-2 text-sm font-normal text-blue-600">Elasticity Index</span>
          </p>
        </div>
        <div className="mt-4">
          <MiniBarChart data={priceSensitivity.trend} />
          <p className="mt-2 text-xs text-slate-500">Mentions: {priceSensitivity.mentionShare}% of conversations</p>
        </div>
      </div>

      {/* Regional Signals Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div>
          <h3 className="flex items-center text-sm font-semibold text-slate-600">
            <Globe2 className="mr-1 h-4 w-4" /> Regional Signals
          </h3>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {regionalSignals.total}
            <span className="ml-2 text-sm font-normal text-slate-600">Signals</span>
          </p>
        </div>
        <div className="mt-3 space-y-2">
          {regionalData.slice(0, 3).map((region, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-slate-700">{region.name}</span>
              <span className="font-medium text-slate-900">{region.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsGrid;
