import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Simple currency formatter – tweak symbol if you want
const formatCurrency = (amount, currency = '$') => {
  const num = Number(amount || 0);
  return (
    currency +
    num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
};

const IncomeTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;

  return (
    <div className="rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.10)] px-4 py-3 border border-slate-200 min-w-[220px]">
      <div className="text-xs font-medium text-slate-500 mb-1">{data?.month}</div>

      <div className="text-[11px] uppercase tracking-wide text-slate-400">Total</div>
      <div className="text-lg font-semibold text-violet-600 mb-2">
        {formatCurrency(data?.totalAmount)}
      </div>

      {Array.isArray(data?.items) && data.items.length > 0 && (
        <div className="mt-1">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Details</div>

          <div className="space-y-0.5 max-h-32 overflow-y-auto pr-1">
            {data.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-[11px] text-slate-600"
              >
                <span className="truncate mr-2">{item.name}</span>
                <span className="font-medium text-slate-900">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomLineChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No income data yet. Add some incomes to see your trends.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          {/* Grid */}
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />

          {/* Gradient */}
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity={0.9} />
              <stop offset="50%" stopColor="#34D399" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#A855F7" stopOpacity={0.95} />
            </linearGradient>
          </defs>

          {/* X axis */}
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y axis */}
          <YAxis
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${Number(v || 0).toLocaleString()}`}
          />

          {/* Tooltip */}
          <Tooltip
            content={<IncomeTooltip />}
            cursor={{ stroke: '#94A3B8', strokeDasharray: '4 4' }}
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="totalAmount"
            stroke="url(#incomeGradient)"
            strokeWidth={3}
            dot={{
              r: 4,
              strokeWidth: 2,
              stroke: '#A855F7',
              fill: '#fff',
            }}
            activeDot={{
              r: 6,
              strokeWidth: 0,
              fill: '#A855F7',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
