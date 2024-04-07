import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    products: {
        columns: [],
        values: []
    }
}



const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        addProducts: (state, action) => {
            state.products = {
                columns: action.payload.columns,
                values: action.payload.values
            }
        }
    }
})


export const productSliceReducer = productsSlice.reducer
export const { addProducts } = productsSlice.actions