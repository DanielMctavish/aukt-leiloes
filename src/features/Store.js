import { configureStore } from '@reduxjs/toolkit'
import { productSliceReducer } from './product/Products';


const store = configureStore({
    reducer: {
        products:productSliceReducer
    }
})


export default store;