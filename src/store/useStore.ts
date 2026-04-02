import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Role, Theme, FilterState } from '../types';

interface AppState {
  transactions: Transaction[];
  role: Role;
  theme: Theme;
  filters: FilterState;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setRole: (role: Role) => void;
  setTheme: (theme: Theme) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const mockTransactions: Transaction[] = [
  { id: '1', date: new Date(Date.now() - 86400000 * 2).toISOString(), amount: 4500, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: new Date(Date.now() - 86400000 * 5).toISOString(), amount: 1500, category: 'Housing', type: 'expense', description: 'Apartment Rent' },
  { id: '3', date: new Date(Date.now() - 86400000 * 12).toISOString(), amount: 120, category: 'Food', type: 'expense', description: 'Supermarket' },
  { id: '4', date: new Date(Date.now() - 86400000 * 15).toISOString(), amount: 60, category: 'Entertainment', type: 'expense', description: 'Movie Tickets' },
  { id: '5', date: new Date(Date.now() - 86400000 * 20).toISOString(), amount: 300, category: 'Utilities', type: 'expense', description: 'Internet & Electricity' },
  { id: '6', date: new Date(Date.now() - 86400000 * 25).toISOString(), amount: 200, category: 'Side Hustle', type: 'income', description: 'Freelance gig' },
];

const defaultFilters: FilterState = {
  searchQuery: '',
  type: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'viewer',
      theme: 'light',
      filters: defaultFilters,

      addTransaction: (transaction) => set((state) => ({
        transactions: [
          { ...transaction, id: crypto.randomUUID() },
          ...state.transactions
        ]
      })),

      editTransaction: (id, transaction) => set((state) => ({
        transactions: state.transactions.map((t) => 
          t.id === id ? { ...transaction, id } : t
        )
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      })),

      setRole: (role) => set({ role }),
      
      setTheme: (theme) => set({ theme }),

      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),

      resetFilters: () => set({ filters: defaultFilters })
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);
