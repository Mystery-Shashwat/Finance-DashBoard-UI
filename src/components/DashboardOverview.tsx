import { SummaryCards } from './SummaryCards';
import { Charts } from './Charts';

export function DashboardOverview() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SummaryCards />
      <Charts />
    </div>
  );
}
