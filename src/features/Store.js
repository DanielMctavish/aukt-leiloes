import { configureStore } from '@reduxjs/toolkit'
import { productSliceReducer } from './product/Products';
import { auctSliceReducer } from './auct/Auct';


const store = configureStore({
    reducer: {
        products: productSliceReducer,
        aucts: auctSliceReducer
    }
})


export default store;