import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.10)] px-4 py-3">
      <div className="text-xs font-semibold text-slate-900">{item?.name}</div>
      <div className="text-sm text-slate-600 mt-1">{formatCurrency(item?.amount)}</div>
    </div>
  );
};

const CustomPieChart = ({ data = [], label, totalAmount, colors = [], showTextAnchor = true }) => {
  const safeData =
    data?.map((d) => ({
      name: d.name,
      amount: Number(d.amount || 0),
    })) || [];

  const hasData = safeData.some((d) => d.amount > 0);

  const chartData = hasData ? safeData : [{ name: 'No Data', amount: 1 }];

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] items-center gap-6">
        {/* Chart */}
        <div className="relative">
          {/* subtle glow */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl" />
          </div>

          <div className="h-[220px] w-[260px] max-w-full mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={<ChartTooltip />}
                  wrapperStyle={{ zIndex: 50 }}
                  allowEscapeViewBox={{ x: true, y: true }}
                />
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={96}
                  paddingAngle={3}
                  stroke="rgba(226,232,240,0.9)"
                  strokeWidth={1}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={hasData ? colors[index % colors.length] || '#94A3B8' : '#E2E8F0'}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center label */}
          {showTextAnchor && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {label}
                </div>
                <div className="mt-1 text-2xl font-semibold text-slate-900">
                  {hasData ? totalAmount : '$0'}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {hasData ? 'Live snapshot' : 'No transactions yet'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Breakdown
          </div>

          <div className="space-y-2">
            {(hasData ? safeData : []).map((item, idx) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="text-sm font-medium text-slate-800 truncate">{item.name}</span>
                </div>

                <div className="text-sm font-semibold text-slate-900">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            ))}

            {!hasData && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <p className="text-slate-700 font-medium">No data yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Add income/expenses to unlock your overview.
                </p>
              </div>
            )}
          </div>

          {/* Micro hint */}
          <div className="text-xs text-slate-500">Hover the chart to see exact values.</div>
        </div>
      </div>
    </div>
  );
};

export default CustomPieChart;
