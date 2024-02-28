import { configureStore } from '@reduxjs/toolkit'
import { productSliceReducer } from './product/Products';
import { auctSliceReducer } from './auct/Auct';
import { auctSelectedSliceReducer } from './auct/SelectedAuct';
import { auctEditReducer } from './auct/AuctToEdit';
import { auctListReducer } from './auct/AuctList';


const store = configureStore({
    reducer: {
        products: productSliceReducer,
        aucts: auctSliceReducer,
        selectedAuct: auctSelectedSliceReducer,
        auctEdit: auctEditReducer,
        auctList: auctListReducer
    }
})


export default store;