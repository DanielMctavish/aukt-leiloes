import { createSlice } from "@reduxjs/toolkit";

//uploadFinished: (state, action) => {}

const initialState = {
    uploadConfirmation: false
}



const productSlice = createSlice({
    name: "upload_confirmation",
    initialState,
    reducers: {
        uploadFinished: (state, action) => {
            state.uploadConfirmation = action.payload
        }
    }
})


export const uploadConfirmationReducer = productSlice.reducer
export const { uploadFinished } = productSlice.actions

