export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1.0';

const CLOUDINARY_CLOUD_NAME = 'dr3pehhi2';

export const API_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  ACTIVATE: '/activate',
  RESEND_VERIFICATION: '/resend-verification',
  GET_USER_INFO: '/profile',

  GET_ALL_CATEGORIES: '/categories',
  ADD_CATEGORY: '/categories',
  UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
  CATEGORY_BY_TYPE: (type) => `/categories/${type}`,

  GET_ALL_INCOMES: '/incomes',
  ADD_INCOME: '/incomes',
  DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,

  INCOME_EXCEL_DOWNLOAD: '/excel/download/income',
  EMAIL_INCOME: '/email/income-excel',

  GET_ALL_EXPENSES: '/expenses',
  ADD_EXPENSE: '/expenses',
  DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,

  EXPENSE_EXCEL_DOWNLOAD: '/excel/download/expense',
  EMAIL_EXPENSE: '/email/expense-excel',

  APPLY_FILTER: '/filter',
  DASHBOARD_DATA: '/dashboard',

  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
};
