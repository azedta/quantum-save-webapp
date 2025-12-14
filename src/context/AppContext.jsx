import { createContext, useCallback, useMemo, useState } from 'react';
import axiosConfig from '../util/axiosConfig.jsx';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  // ───────────────── USER ─────────────────
  const [user, _setUser] = useState(null);
  const setUser = useCallback((u) => _setUser(u), []);

  // ─────────────── DASHBOARD CACHE ───────────────
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const fetchDashboardData = useCallback(
    async ({ force = false } = {}) => {
      if (dashboardLoading) return;
      if (dashboardData && !force) return;

      setDashboardLoading(true);
      try {
        const res = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
        if (res.status === 200) setDashboardData(res.data);
      } finally {
        setDashboardLoading(false);
      }
    },
    [dashboardLoading, dashboardData],
  );

  // ─────────────── CATEGORIES CACHE ───────────────
  const [categories, _setCategories] = useState([]); // ✅ always array
  const setCategories = useCallback((arr) => _setCategories(arr), []);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const fetchCategories = useCallback(
    async ({ force = false } = {}) => {
      if (categoriesLoading) return;
      if (categories.length > 0 && !force) return;

      setCategoriesLoading(true);
      try {
        const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
        if (res.status === 200) _setCategories(res.data);
      } finally {
        setCategoriesLoading(false);
      }
    },
    [categoriesLoading, categories.length],
  );

  // ─────────────── INCOME CACHE ───────────────
  const [incomeData, setIncomeData] = useState([]); // ✅ always array
  const [incomeFetchedAt, setIncomeFetchedAt] = useState(null);

  // ─────────────── EXPENSE CACHE ───────────────
  const [expenseData, setExpenseData] = useState([]); // ✅ always array
  const [expenseFetchedAt, setExpenseFetchedAt] = useState(null);

  // ─────────────── CLEAR USER ───────────────
  const clearUser = useCallback(() => {
    _setUser(null);

    // clear app caches
    setDashboardData(null);
    _setCategories([]);

    setIncomeData([]);
    setExpenseData([]);
    setIncomeFetchedAt(null);
    setExpenseFetchedAt(null);
  }, []);

  const value = useMemo(
    () => ({
      // user
      user,
      setUser,
      clearUser,

      // dashboard (Home.jsx depends on these) :contentReference[oaicite:1]{index=1}
      dashboardData,
      dashboardLoading,
      fetchDashboardData,

      // categories (Category.jsx depends on these) :contentReference[oaicite:2]{index=2}
      categories,
      categoriesLoading,
      fetchCategories,
      setCategories,

      // income
      incomeData,
      setIncomeData,
      incomeFetchedAt,
      setIncomeFetchedAt,

      // expense
      expenseData,
      setExpenseData,
      expenseFetchedAt,
      setExpenseFetchedAt,
    }),
    [
      user,
      setUser,
      clearUser,

      dashboardData,
      dashboardLoading,
      fetchDashboardData,

      categories,
      categoriesLoading,
      fetchCategories,
      setCategories,

      incomeData,
      incomeFetchedAt,

      expenseData,
      expenseFetchedAt,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
