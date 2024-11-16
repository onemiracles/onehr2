import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DepartmentService from '../services/DepartmentService';

export const fetchDepartmentStats = createAsyncThunk(
  'employees/fetchDepartmentStats',
  async ({ tenantId }, thunkAPI) => {
    const departmentService = new DepartmentService(tenantId);
    try {
      const response = await departmentService.getDepartmentStats();
      return {
        tenantId,
        data: response
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const departmentStatsSlice = createSlice({
  name: 'departmentStats',
  initialState: {
    data: {},
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartmentStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartmentStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data[action.payload.tenantId] = action.payload.data;
      })
      .addCase(fetchDepartmentStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default departmentStatsSlice.reducer;
