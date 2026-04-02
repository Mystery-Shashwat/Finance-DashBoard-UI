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

## Technical Decisions and Trade-offs

- **React + Vite**: Chosen for fast development, instant Hot Module Replacement (HMR), and a clean build pipeline. *Trade-off:* Lacks out-of-the-box routing or API integration compared to frameworks like Next.js, but this isn't needed for a client-focused UI dashboard assignment.
- **Tailwind CSS**: Allowed for rapid, utility-first UI development and made implementing the Dark/Light mode toggle effortless without writing bulky CSS files. *Trade-off:* Results in somewhat cluttered JSX markup due to long class strings, but the development speed and consistency are highly beneficial here.
- **Zustand (Global State)**: Extremely lightweight with minimal boilerplate compared to Redux. Easily manages the transactions, theme, roles, and filters. *Trade-off:* Lacks the expansive middleware logging ecosystem of Redux, but Redux would be architectural overkill for this application's scope.
- **Zustand Persist (Local Storage)**: Fulfills the "data persistence" requirement out of the box. *Trade-off:* Stores data synchronously in the browser with size limits (~5MB). Excellent for an evaluation mockup but wouldn't be used in production with a real database.
- **Client-Side Data Manipulation**: Searching and filtering logics run directly in React using `useMemo`. *Trade-off:* Provides instantaneous UX feedback without network latency. However, this is unscalable for datasets exceeding thousands of rows where server-side pagination would be necessary.
- **Recharts**: Selected for declarative, responsive, and animated SVG charts. *Trade-off:* Brings a slight bundle size cost compared to drawing a simple custom canvas, but it dramatically improves the professional feel and analytical interactivity of the dashboard.

## Running the Project Locally

If you want to view the React application on your own local device:

1. Open your terminal
2. Run `npm install`
3. Run `npm run dev`
4. Navigate to http://localhost:5173
