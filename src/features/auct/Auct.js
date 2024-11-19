import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    advertiser_id: "",
    title: '',
    tags: [],
    auct_cover_img: '',
    product_list: [],
    descriptions_informations: '',
    terms_conditions: '',
    auct_dates: [],
    limit_client: false,
    limit_date: false,
    methods_payments: ['Credit'],
    value: 0,
    status: "",
    product_timer_seconds: 30
}



const auctsSlice = createSlice({
    name: "auct",
    initialState,
    reducers: {
        addAuct: (state, action) => {
            return state = { ...state, ...action.payload }
        }
    }
});



export const auctSliceReducer = auctsSlice.reducer
export const { addAuct } = auctsSlice.actions