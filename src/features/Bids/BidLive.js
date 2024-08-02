import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    bidLive: {}
}

const bidSlice = createSlice({
    name: "bid-live",
    initialState,
    reducers: {
        addBidLive: (state, action) => {
            state.bidLive = action.payload; // Atualize o estado diretamente
        }
    }
});

export const bidLiveSliceReducer = bidSlice.reducer
export const { addBidLive } = bidSlice.actions
