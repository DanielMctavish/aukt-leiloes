import { configureStore } from '@reduxjs/toolkit'
import { productSliceReducer } from './product/Products';
import { auctSliceReducer } from './auct/Auct';
import { auctSelectedSliceReducer } from './auct/SelectedAuct';


const store = configureStore({
    reducer: {
        products: productSliceReducer,
        aucts: auctSliceReducer,
        selectedAuct: auctSelectedSliceReducer
    }
})


export default store;