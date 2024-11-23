import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DepartmentService from '../services/DepartmentService';
import { extraReducers } from '../utils';

export const fetchAllDepartment = createAsyncThunk(
  'departments/fetchAllDepartment',
  async ({ tenantId }, thunkAPI) => {
    const departmentService = new DepartmentService(tenantId);
    try {
      const response = await departmentService.getAllDepartments();
      return {
        name: 'allDepartments',
        tenantId,
        response
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchDepartmentStats = createAsyncThunk(
  'departments/fetchDepartmentStats',
  async ({ tenantId }, thunkAPI) => {
    const departmentService = new DepartmentService(tenantId);
    try {
      const response = await departmentService.getDepartmentStats();
      return {
        name: 'departmentStats',
        tenantId,
        response
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {},
  extraReducers: (builder) => {
    extraReducers(builder, [fetchAllDepartment, fetchDepartmentStats]);
  },
});

export default departmentSlice.reducer;
