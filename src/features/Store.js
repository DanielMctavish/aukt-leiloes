import { configureStore } from '@reduxjs/toolkit'
import { productSliceReducer } from './product/Products';
import { auctSliceReducer } from './auct/Auct';
import { auctSelectedSliceReducer } from './auct/SelectedAuct';
import { auctEditReducer } from './auct/AuctToEdit';
import { auctListReducer } from './auct/AuctList';
import { productSelectedReducer } from './product/ProductAddPhoto';
import { groupDateSliceReducer } from './GroupDates/GroupDate';
import { errorSliceSliceReducer } from './errors/ReportErrorAtCreateAuct';
import { resumeAuctSliceReducer } from './auct/ResumeAuctBalance';
import { uploadConfirmationReducer } from "./product/UploadFinished"
import { bidLiveSliceReducer } from './Bids/BidLive';
import { themeSliceReducer } from './theme/PlataformTheme';
import { auctLiveSliceReducer } from './auct/LiveSelected';
import { selectedToGraphReducer } from './auct/SelectedToGraph';
import { controlButtonsReducer } from './auct/controlButtonsSlice';
import { auctionListReducer } from './auct/AuctionListSlice';
import { currentProductReducer } from './auct/CurrentProductSlice';

const store = configureStore({
    reducer: {
        products: productSliceReducer,
        aucts: auctSliceReducer,
        selectedAuct: auctSelectedSliceReducer,
        auctEdit: auctEditReducer,
        auctList: auctListReducer,
        selectedProduct: productSelectedReducer,
        groupDate: groupDateSliceReducer,
        errorReports: errorSliceSliceReducer,
        auctResume: resumeAuctSliceReducer,
        finishedUpload: uploadConfirmationReducer,
        bidLive: bidLiveSliceReducer,
        theme: themeSliceReducer,
        live: auctLiveSliceReducer,
        selectedToGraph: selectedToGraphReducer,
        controlButtons: controlButtonsReducer,
        auctionList: auctionListReducer,
        currentProduct: currentProductReducer
    }
})

export default store;