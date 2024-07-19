import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    bid_live: {}
}


const bidLive = createSlice({
    name: "bid-live",
    initialState,
    reducers: {
        addBidLive: (state, action) => {
            return state = action.payload.bid_live
        }
    }
});



export const bidLiveSliceReducer = bidLive.reducer
export const { addBidLive } = bidLive.actions