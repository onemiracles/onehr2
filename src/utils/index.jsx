export { cn } from './cn';
export { formatDate } from './format';

export const extraReducers = (builder, list) => {
    list.forEach((e) => {
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
};