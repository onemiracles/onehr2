import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import employeeReducer from './employeeSlice';
import departmentStatsReducer from './departmentSlice';

const store = configureStore({
  reducer: {
    modals: modalReducer,
    employees: employeeReducer,
    departmentStats: departmentStatsReducer,
  },
});

export default store;