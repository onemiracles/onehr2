import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EmployeeService from '../services/EmployeeService';

export const fetchAllEmployees = createAsyncThunk(
  'employees/fetchAllEmployees',
  async ({ tenantId }, thunkAPI) => {
    const employeeService = new EmployeeService(tenantId);
    try {
      const response = await employeeService.getAllEmployees();
      return {
        name: 'allEmployees',
        tenantId,
        response
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {},
  extraReducers: (builder) => {
    [fetchAllEmployees].forEach((e) => {
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

export default employeeSlice.reducer;
