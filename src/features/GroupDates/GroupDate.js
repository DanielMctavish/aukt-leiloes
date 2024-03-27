import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    groupDates: []
}


const groupSlice = createSlice({
    name: "group_date",
    initialState,
    reducers: {
        addGroupDate: (state, action) => {
            state.groupDates = action.payload
        }
    }
});



export const groupDateSliceReducer = groupSlice.reducer
export const { addGroupDate } = groupSlice.actions