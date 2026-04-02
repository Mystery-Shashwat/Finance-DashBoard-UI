import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Plus, Search, ArrowDownToLine } from 'lucide-react';
import { TransactionModal } from './TransactionModal';
import { Transaction } from '../types';

export function TransactionList() {
  const { transactions, role, deleteTransaction, filters, setFilters } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const filteredData = useMemo(() => {
    let result = transactions;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }
    
    result = [...result].sort((a, b) => {
      if (filters.sortBy === 'date') {
        const diff = parseISO(b.date).getTime() - parseISO(a.date).getTime();
        return filters.sortOrder === 'desc' ? diff : -diff;
      } else {
        const diff = b.amount - a.amount;
        return filters.sortOrder === 'desc' ? diff : -diff;
      }
    });

    return result;
  }, [transactions, filters]);

  const handleEdit = (t: Transaction) => {
    setEditingTx(t);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(t => 
        `"${format(parseISO(t.date), 'yyyy-MM-dd')}","${t.description}","${t.category}","${t.type}","${t.amount}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground">Transactions</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={filters.searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              className="pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
            />
          </div>
          <select 
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value as any })}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center px-3 py-2 bg-muted text-foreground border border-border rounded-md hover:bg-background transition-colors"
            title="Export to CSV"
          >
             <ArrowDownToLine className="w-4 h-4" />
          </button>
          {role === 'admin' && (
            <button 
              onClick={handleNew}
              className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" /> New
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              {role === 'admin' && <th className="px-6 py-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? filteredData.map((t) => (
              <tr key={t.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 text-foreground">{format(parseISO(t.date), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4 font-medium text-foreground">{t.description}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  <span className="bg-muted px-2 py-1 rounded-md text-xs">{t.category}</span>
                </td>
                <td className={`px-6 py-4 font-semibold ${t.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </td>
                {role === 'admin' && (
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(t)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteTransaction(t.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-12 text-center text-muted-foreground">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transaction={editingTx} 
      />
    </div>
  );
}
