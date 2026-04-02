import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Wallet, LayoutDashboard, ArrowRightLeft, PieChart, Moon, Sun, UserCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'transactions' | 'insights';
  onTabChange: (tab: 'dashboard' | 'transactions' | 'insights') => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { theme, setTheme, role, setRole } = useStore();

  // Handle Dark Mode toggling using tailwind class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Wallet className="w-6 h-6 text-primary mr-2" />
          <span className="font-bold text-lg text-foreground">FinDash</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => onTabChange('dashboard')}
            className={cn("w-full flex items-center px-4 py-3 rounded-lg transition-colors", activeTab === 'dashboard' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </button>
          <button
            onClick={() => onTabChange('transactions')}
            className={cn("w-full flex items-center px-4 py-3 rounded-lg transition-colors", activeTab === 'transactions' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
          >
            <ArrowRightLeft className="w-5 h-5 mr-3" /> Transactions
          </button>
          <button
            onClick={() => onTabChange('insights')}
            className={cn("w-full flex items-center px-4 py-3 rounded-lg transition-colors", activeTab === 'insights' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
          >
            <PieChart className="w-5 h-5 mr-3" /> Insights
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold capitalize text-foreground">
            {activeTab}
          </h1>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-3 border-l border-border pl-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">Demo User</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'viewer' | 'admin')}
                  className="text-xs text-muted-foreground bg-transparent border-none outline-none cursor-pointer font-medium"
                >
                  <option value="viewer" className="bg-card">Viewer Mode</option>
                  <option value="admin" className="bg-card">Admin Mode</option>
                </select>
              </div>
              <UserCircle className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
