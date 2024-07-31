import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    error: false
};

const errorSlice = createSlice({
    name: "error_reports",
    initialState,
    reducers: {
        reportError: (state, action) => {
            state.error = action.payload; 
        }
    }
});

export const errorSliceSliceReducer = errorSlice.reducer;
export const { reportError } = errorSlice.actions;
