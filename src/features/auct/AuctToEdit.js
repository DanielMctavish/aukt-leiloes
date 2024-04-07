import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    advertiser_id: "",
    title: '',
    tags: [],
    auct_cover_img: '',
    descriptions_informations: '',
    terms_conditions: '',
    auct_dates: [],
    limit_client: false,
    limit_date: false,
    accept_payment_methods: 'Credit',
    product_timer_seconds: 30
}

const auctEditSlice = createSlice({
    name: "auct_edit",
    initialState,
    reducers: {
        editAuct: (state, action) => {
            return state = action.payload
        }
    }
});

export const auctEditReducer = auctEditSlice.reducer
export const { editAuct } = auctEditSlice.actions