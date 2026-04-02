import { useStore } from '../store/useStore';
import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Charts() {
  const { transactions, theme } = useStore();

  const { areaData, pieData } = useMemo(() => {
    // Area Chart Data
    const sorted = [...transactions].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    let currentBalance = 0;
    const areaMap = new Map<string, number>();

    sorted.forEach((t) => {
      const day = format(parseISO(t.date), 'MMM dd');
      if (t.type === 'income') currentBalance += t.amount;
      else currentBalance -= t.amount;
      areaMap.set(day, currentBalance);
    });

    const finalAreaData = Array.from(areaMap.entries()).map(([date, balance]) => ({
      date,
      balance,
    }));

    // Pie Chart Data
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryMap = new Map<string, number>();
    expenses.forEach(t => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });
    
    const finalPieData = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { areaData: finalAreaData, pieData: finalPieData };
  }, [transactions]);

  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-foreground">Balance Trend</h3>
        <div className="h-[300px]">
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: textColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderRadius: '8px', border: 'none', color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}
                  formatter={(value: any) => [formatCurrency(value), 'Balance']}
                />
                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex h-full items-center justify-center text-muted-foreground">Not enough data.</div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-foreground">Spending Breakdown</h3>
        <div className="h-[300px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderRadius: '8px', border: 'none' }}
                  itemStyle={{color: theme === 'dark' ? '#fff' : '#111'}}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No expenses recorded.</div>
          )}
        </div>
      </div>
    </div>
  );
}
