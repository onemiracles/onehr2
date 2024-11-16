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

export default employeeSlice.reducer;
