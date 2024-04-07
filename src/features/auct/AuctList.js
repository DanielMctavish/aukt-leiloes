import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    auct_list:[]
}

const auctListSlice = createSlice({
    name: "auctList",
    initialState,
    reducers: {
        listAuct: (state, action) => {
            return state = action.payload 
        }
    }
});

export const auctListReducer = auctListSlice.reducer
export const { listAuct } = auctListSlice.actions