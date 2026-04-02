export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export type Role = 'viewer' | 'admin';
export type Theme = 'light' | 'dark';

export interface FilterState {
  searchQuery: string;
  type: 'all' | TransactionType;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}
