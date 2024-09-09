import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isRunning: false,
    isPaused: false,
};

const controlButtonsSlice = createSlice({
    name: "controlButtons",
    initialState,
    reducers: {
        setRunning: (state, action) => {
            state.isRunning = action.payload;
        },
        setPaused: (state, action) => {
            state.isPaused = action.payload;
        },
    },
});

export const { setRunning, setPaused } = controlButtonsSlice.actions;
export const controlButtonsReducer = controlButtonsSlice.reducer;