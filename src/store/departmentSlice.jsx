import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DepartmentService from '../services/DepartmentService';

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
    [fetchAllDepartment, fetchDepartmentStats].forEach((e) => {
      builder
        .addCase(e.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(e.fulfilled, (state, action) => {
          const {tenantId, name, response} = action.payload;
          if (!state[tenantId]) {
            state[tenantId] = {};
          }
          if (!state[tenantId][name]) {
            state[tenantId][name] = {};
          }
          state[tenantId][name] = response;
          state.status = 'succeeded';
        })
        .addCase(e.rejected, (state, action) => {
          const {tenantId, name, error} = action.payload;
          if (!state[tenantId]) {
            state[tenantId] = {};
          }
          if (!state[tenantId][name]) {
            state[tenantId][name] = {};
          }
          state.status = 'failed';
          state[tenantId][name].error = error;
        });
    });
  },
});

export default departmentSlice.reducer;
