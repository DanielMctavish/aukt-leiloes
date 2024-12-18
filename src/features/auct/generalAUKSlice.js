import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  auct: null,
  group: null,
  status: null,
  currentProduct: null,
  currentTimer: null,
};

const generalAUKSlice = createSlice({
  name: 'generalAUK',
  initialState,
  reducers: {
    setAuct: (state, action) => {
      state.auct = action.payload;
    },
    setGroup: (state, action) => {
      state.group = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setCurrentTimer: (state, action) => {
      state.currentTimer = action.payload;
    },
    resetGeneralAUK: () => initialState,
  },
});

export const { setAuct, setGroup, setStatus, setCurrentProduct, setCurrentTimer, resetGeneralAUK } = generalAUKSlice.actions;
export default generalAUKSlice.reducer;