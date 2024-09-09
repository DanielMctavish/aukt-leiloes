import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auction: null,
};

const selectedToGraphSlice = createSlice({
  name: "selectedToGraph",
  initialState,
  reducers: {
    selectAuctionForGraph: (state, action) => {
      state.auction = action.payload;
    },
  },
});

export const selectedToGraphReducer = selectedToGraphSlice.reducer;
export const { selectAuctionForGraph } = selectedToGraphSlice.actions;