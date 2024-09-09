import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    auctions: []
};

const auctionListSlice = createSlice({
    name: "auctionList",
    initialState,
    reducers: {
        setAuctionList: (state, action) => {
            state.auctions = action.payload;
        }
    }
});

export const auctionListReducer = auctionListSlice.reducer;
export const { setAuctionList } = auctionListSlice.actions;