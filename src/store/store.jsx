import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice';
import departmentReducer from './departmentSlice';
import payrollReducer from './payrollSlice';

const store = configureStore({
  reducer: {
    employees: employeeReducer,
    departments: departmentReducer,
    payrolls: payrollReducer
  },
});

export default store;