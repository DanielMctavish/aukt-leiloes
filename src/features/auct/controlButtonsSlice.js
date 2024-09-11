import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isRunning: false,
    isPaused: false,
    currentAuctionId: null,
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
        setCurrentAuctionId: (state, action) => {
            state.currentAuctionId = action.payload;
        },
    },
});

export const { setRunning, setPaused, setCurrentAuctionId } = controlButtonsSlice.actions;
export const controlButtonsReducer = controlButtonsSlice.reducer;