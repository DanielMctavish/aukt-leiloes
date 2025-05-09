import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    auct_id: "",
}


const auctSelectedSlice = createSlice({
    name: "auct-selected",
    initialState,
    reducers: {
        selectedAuct: (state, action) => {
            return state = action.payload.auct_id
        }
    }
});



export const auctSelectedSliceReducer = auctSelectedSlice.reducer
export const { selectedAuct } = auctSelectedSlice.actions