import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modals',
  initialState: {
    modals: [],
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables serializable check
    }),
  reducers: {
    showModal: (state, action) => {
      console.log(action.payload);
      const {content, options = {}} = action.payload;
      const defaultOptions = {
        size: 'md',
        showClose: true,
        closeOnClickOutside: true,
        loading: false,
        ...options,
      };
      const modal = { isOpen: true, content, options: defaultOptions };
      state.modals =  [...state.modals, modal];
    },
    hideModal: (state, action) => {
      const newModals = state.modals;
      if (newModals.length > 0) {
        return newModals.slice(0, -1);
      }
      state.modals = newModals;
    },
    hideAllModal: (state, action) => {
      state.modals = [];
    }
  },
});

export const { showModal, hideModal, hideAllModal } = modalSlice.actions;
export default modalSlice.reducer;
