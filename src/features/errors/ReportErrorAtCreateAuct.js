import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    error: []
}


const errorSlice = createSlice({
    name: "error_reports",
    initialState,
    reducers: {
        reportError: (state, action) => {
            state = action.payload
        }
    }
});



export const errorSliceSliceReducer = errorSlice.reducer
export const { reportError } = errorSlice.actions