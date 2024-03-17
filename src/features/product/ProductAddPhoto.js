import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    product: {}
}



const productSlice = createSlice({
    name: "product_selected",
    initialState,
    reducers: {
        selectProduct: (state, action) => {
            state.product = action.payload
        }
    }
})


export const productSelectedReducer = productSlice.reducer
export const { selectProduct } = productSlice.actions