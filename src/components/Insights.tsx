import { useStore } from '../store/useStore';
import { useMemo } from 'react';
import { formatCurrency } from '../lib/utils';
import { Lightbulb, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

export function Insights() {
  const { transactions } = useStore();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let topCategory = { name: 'None', amount: 0 };
    Object.entries(categoryTotals).forEach(([name, amount]) => {
      if (amount > topCategory.amount) topCategory = { name, amount };
    });

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return [
      {
        id: 1,
        title: 'Top Expense Category',
        desc: `You've spent ${formatCurrency(topCategory.amount)} on ${topCategory.name}.`,
        icon: <TrendingUp className="w-5 h-5 text-orange-500" />
      },
      {
        id: 2,
        title: 'Savings Overview',
        desc: savingsRate > 20 
          ? `Great job! Your savings rate is ${savingsRate.toFixed(1)}%.` 
          : `Your savings rate is ${savingsRate.toFixed(1)}%. Consider reducing expenses.`,
        icon: savingsRate > 20 ? <Lightbulb className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />
      },
      {
        id: 3,
        title: 'Transaction Count',
        desc: `You have logged ${transactions.length} transactions total.`,
        icon: <ArrowRight className="w-5 h-5 text-blue-500" />
      }
    ];
  }, [transactions]);

  return (
    <div className="grid gap-6 md:grid-cols-3 animate-in fade-in duration-500">
      {insights.map(item => (
        <div key={item.id} className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-muted rounded-lg">
            {item.icon}
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
