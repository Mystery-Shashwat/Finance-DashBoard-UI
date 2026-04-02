import { useStore } from '../store/useStore';
import { ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useMemo } from 'react';

export function SummaryCards() {
  const { transactions } = useStore();

  const { income, expense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.income += curr.amount;
          acc.balance += curr.amount;
        } else {
          acc.expense += curr.amount;
          acc.balance -= curr.amount;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Balance</h3>
          <DollarSign className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
      </div>
      
      <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Income</h3>
          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-3xl font-bold">{formatCurrency(income)}</div>
      </div>

      <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Expenses</h3>
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-3xl font-bold">{formatCurrency(expense)}</div>
      </div>
    </div>
  );
}
