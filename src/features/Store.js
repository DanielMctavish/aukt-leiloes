import { configureStore } from '@reduxjs/toolkit'
import { productSliceReducer } from './product/Products';
import { auctSliceReducer } from './auct/Auct';
import { auctSelectedSliceReducer } from './auct/SelectedAuct';
import { auctEditReducer } from './auct/AuctToEdit';


const store = configureStore({
    reducer: {
        products: productSliceReducer,
        aucts: auctSliceReducer,
        selectedAuct: auctSelectedSliceReducer,
        auctEdit: auctEditReducer
    }
})


export default store;