import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PayrollService from '../services/PayrollService';

export const fetchPayrollHistory = createAsyncThunk(
  'payrolls/fetchPayrolls',
  async ({ tenantId, currentPage, search }, thunkAPI) => {
    const payrollService = new PayrollService(tenantId);
    try {
      const response = await payrollService.getPayrolls({ currentPage, search });
      return {
        name: 'payrollHistory',
        tenantId,
        response
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        name: 'payrollHistory',
        tenantId,
        error: error.message
      });
    }
  }
);

export const fetchPayrollStats = createAsyncThunk(
  'payrolls/fetchPayrollStats',
  async ({ tenantId }, thunkAPI) => {
    const payrollService = new PayrollService(tenantId);
    try {
      //TODO: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = {
        monthlyTrend: [
          { month: 'Jan', amount: 820000 },
          { month: 'Feb', amount: 845000 },
          { month: 'Mar', amount: 850000 },
          { month: 'Apr', amount: 855000 },
        ],
        averageSalary: 85000,
        totalBenefits: 180000,
        totalTaxes: 255000
      };
      return {
        name: 'payrollStats',
        tenantId,
        response
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        name: 'payrollStats',
        tenantId,
        error: error.message
      });
    }
  }
);

const payrollSlice = createSlice({
  name: 'payrolls',
  initialState: {
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    [fetchPayrollHistory, fetchPayrollStats].forEach((e) => {
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

export default payrollSlice.reducer;
