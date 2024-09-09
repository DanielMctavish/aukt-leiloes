import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    auction: null,
    group: null
}

const liveSelectedSlice = createSlice({
    name: "auct-live-selected",
    initialState,
    reducers: {
        selectLiveAuction: (state, action) => {
            state.auction = action.payload
        },
        selectLiveGroup: (state, action) => {
            state.group = action.payload
        }
    }
});

export const auctLiveSliceReducer = liveSelectedSlice.reducer
export const { selectLiveAuction, selectLiveGroup } = liveSelectedSlice.actions
