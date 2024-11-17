import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import {employeeReducer, allEmployeeReducer} from './employeeSlice';
import {departmentStatsReducer, allDepartmentReducer} from './departmentSlice';

const store = configureStore({
  reducer: {
    modals: modalReducer,
    employees: employeeReducer,
    allEmployees: allEmployeeReducer,
    departmentStats: departmentStatsReducer,
    allDepartment: allDepartmentReducer
  },
});

export default store;