import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    winner: {}
}

const winnerLiveSlice = createSlice({
    name: "winner-live",
    initialState,
    reducers: {
        setCurrentWinner: (state, action) => {
            return state.winner = action.payload
        }
    }
});

export const auctListReducer = winnerLiveSlice.reducer
export const { setCurrentWinner } = winnerLiveSlice.actions