# Finance Dashboard UI Walkthrough

The Finance Dashboard has been completely built and tested. Here is a summary of how it meets the requirements and instructions on how to run it.

## Approach & Features Implemented

### 1. Dashboard Overview
- Created visual `SummaryCards` for Total Balance, Income, and Expenses using calculations over the global transactions array.
- Designed `Charts.tsx` featuring an Area Chart for balance trends over time and a Donut Chart for spending breakdown per category. Built using recharts for an interactive analytical view.

### 2. Transactions Section
- Implemented `TransactionList.tsx`, a data table showing transaction history.
- Added filtering by specific types (Income/Expense) and live search functionality using a unified Zustand store state.
- Implemented an Export to CSV button for users to easily download their filtered data.

### 3. Basic Role Based UI
- Added a dropdown in the `Layout` Header to toggle between Viewer Mode and Admin Mode.
- Only when Admin Mode is selected, the 'New' transaction button and 'Edit/Delete' row actions appear, mimicking RBAC on the client side.

### 4. Insights Section
- Computed basic statistics iteratively (e.g., tracking the highest spending category dynamically and calculating the current savings rate vs expenses).

### 5. State Management & Enhancements
- **Zustand with LocalStorage Context:** We maintain transactions, theme, role, and filters cleanly separated inside `src/store/useStore.ts` utilizing `zustand/middleware` persist.
- **Dark Mode:** Fully implemented Tailwind styling for seamless dark/light layouts.

## Running the Project Locally

If you want to view the React application on your own local device:

1. Open your terminal at `C:\Users\Shashwat Tripathi\.gemini\antigravity\scratch\finance-dashboard`
2. Run `npm install`
3. Run `npm run dev`
4. Navigate to http://localhost:5173

> **NOTE:** The application uses mock data seeded directly into local storage on the first load.
