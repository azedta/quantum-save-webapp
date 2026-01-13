import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axiosConfig from '../util/axiosConfig.jsx';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  // ───────────────── USER ─────────────────
  const [user, _setUser] = useState(null);
  const setUser = useCallback((u) => _setUser(u), []);

  // ─────────────── AUTH LOADING ───────────────
  const [authLoading, setAuthLoading] = useState(true);

  // ─────────────── DASHBOARD CACHE ───────────────
  const EMPTY_DASHBOARD = useMemo(
    () => ({
      totalBalance: 0,
      totalIncome: 0,
      totalExpense: 0,
      recentTransactions: [],
      recent5Expenses: [],
      recent5Incomes: [],
    }),
    [],
  );

  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // ✅ refs avoid dependency loops
  const dashboardLoadingRef = useRef(false);
  const dashboardDataRef = useRef(null);

  useEffect(() => {
    dashboardLoadingRef.current = dashboardLoading;
  }, [dashboardLoading]);

  useEffect(() => {
    dashboardDataRef.current = dashboardData;
  }, [dashboardData]);

  const invalidateDashboard = useCallback(() => {
    setDashboardData(null);
    dashboardDataRef.current = null;
  }, []);

  const fetchDashboardData = useCallback(
    async ({ force = false } = {}) => {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (dashboardLoadingRef.current) return;
      if (dashboardDataRef.current && !force) return;

      dashboardLoadingRef.current = true;
      setDashboardLoading(true);

      try {
        const res = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
        const data = res?.data ?? EMPTY_DASHBOARD; // ✅ safe default for new users
        setDashboardData(data);
        dashboardDataRef.current = data;
      } finally {
        dashboardLoadingRef.current = false;
        setDashboardLoading(false);
      }
    },
    [EMPTY_DASHBOARD],
  );

  // ─────────────── CATEGORIES CACHE ───────────────
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const invalidateCategories = useCallback(() => {
    setCategoriesLoaded(false);
  }, []);

  const fetchCategories = useCallback(
    async ({ force = false } = {}) => {
      if (categoriesLoading) return;
      if (categoriesLoaded && !force) return;

      setCategoriesLoading(true);
      try {
        const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
        if (res.status === 200) {
          setCategories(res.data ?? []);
          setCategoriesLoaded(true);
        }
      } finally {
        setCategoriesLoading(false);
      }
    },
    [categoriesLoading, categoriesLoaded],
  );

  // ─────────────── INCOME CACHE ───────────────
  const [incomeData, setIncomeData] = useState([]);
  const [incomeFetchedAt, setIncomeFetchedAt] = useState(null);

  // ─────────────── EXPENSE CACHE ───────────────
  const [expenseData, setExpenseData] = useState([]);
  const [expenseFetchedAt, setExpenseFetchedAt] = useState(null);

  // ─────────────── CLEAR USER ───────────────
  const clearUser = useCallback(() => {
    _setUser(null);

    setDashboardData(null);
    dashboardDataRef.current = null;

    setCategories([]);
    setCategoriesLoaded(false);

    setIncomeData([]);
    setExpenseData([]);
    setIncomeFetchedAt(null);
    setExpenseFetchedAt(null);

    // ✅ auth check is done (user is logged out)
    setAuthLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      // user + auth
      user,
      setUser,
      clearUser,
      authLoading,
      setAuthLoading,

      // dashboard
      dashboardData,
      dashboardLoading,
      fetchDashboardData,
      invalidateDashboard,

      // categories
      categories,
      categoriesLoading,
      categoriesLoaded,
      setCategoriesLoaded,
      fetchCategories,
      setCategories,
      invalidateCategories,

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
      authLoading,

      dashboardData,
      dashboardLoading,
      fetchDashboardData,
      invalidateDashboard,

      categories,
      categoriesLoading,
      categoriesLoaded,
      fetchCategories,
      invalidateCategories,

      incomeData,
      incomeFetchedAt,

      expenseData,
      expenseFetchedAt,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
