import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Cached data
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  // ✅ Timestamps (for stale logic)
  const [incomeFetchedAt, setIncomeFetchedAt] = useState(null);
  const [expenseFetchedAt, setExpenseFetchedAt] = useState(null);

  const clearUser = () => setUser(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        clearUser,

        incomeData,
        setIncomeData,
        incomeFetchedAt,
        setIncomeFetchedAt,

        expenseData,
        setExpenseData,
        expenseFetchedAt,
        setExpenseFetchedAt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
