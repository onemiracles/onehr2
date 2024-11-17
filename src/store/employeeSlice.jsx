import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EmployeeService from '../services/EmployeeService';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async ({ tenantId, currentPage, search, filterRole }, thunkAPI) => {
    const employeeService = new EmployeeService(tenantId);
    try {
      const response = await employeeService.getEmployees({ currentPage, search, filterRole });
      const { data, pagination } = response;
      return {
        tenantId,
        data,
        pagination
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  'employees/fetchAllEmployees',
  async ({ tenantId }, thunkAPI) => {
    const employeeService = new EmployeeService(tenantId);
    try {
      const response = await employeeService.getAllEmployees();
      const { data } = response;
      return {
        tenantId,
        data
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    data: {},
    total: 0,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data[action.payload.tenantId] = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

const allEmployeeSlice = createSlice({
  name: 'allEmployees',
  initialState: {
    data: {},
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data[action.payload.tenantId] = action.payload.data;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const employeeReducer = employeeSlice.reducer;
export const allEmployeeReducer = allEmployeeSlice.reducer;
