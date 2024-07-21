import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    bidLive: {}
}


const bidSlice = createSlice({
    name: "bid-live",
    initialState,
    reducers: {
        addBidLive: (state, action) => {
            return state = action.payload.bid_live
        }
    }
});



export const bidLiveSliceReducer = bidSlice.reducer
export const { addBidLive } = bidSlice.actions