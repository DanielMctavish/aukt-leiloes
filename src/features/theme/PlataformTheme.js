import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: {}
};

const themeSlice = createSlice({
    name: "theme-plataform",
    initialState,
    reducers: {
        changeTheme: (state, action) => {
            state.theme = action.payload; 
        }
    }
});

export const themeSliceReducer = themeSlice.reducer;
export const { changeTheme } = themeSlice.actions;
