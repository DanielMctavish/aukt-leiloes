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
        },
        updateProducts: (state, action) => {
            // Atualiza os produtos com os novos valores
            state.products = action.payload;
        }
    }
})


export const productSliceReducer = productsSlice.reducer
export const { addProducts, updateProducts } = productsSlice.actions