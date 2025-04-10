import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    value_balance: 0,
    initial_value_sum: 0
}

const resumeAuctSlice = createSlice({
    name: "auct-resume",
    initialState,
    reducers: {
        addResume: (state, action) => {
            return state = action.payload
        }
    }
});



export const resumeAuctSliceReducer = resumeAuctSlice.reducer
export const { addResume } = resumeAuctSlice.actions