import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EmployeeService from '../services/EmployeeService';
import { extraReducers } from '../utils';

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
    extraReducers(builder, [fetchAllEmployees]);
  },
});

export default employeeSlice.reducer;
