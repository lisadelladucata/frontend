import { createSlice } from "@reduxjs/toolkit";

interface showTradeIn {
    isOpenTradeIn: boolean
}

const initialState : showTradeIn= {
  isOpenTradeIn: false,
};

const showTradeInSlice = createSlice({
  name: "isOpenTradeIn",
  initialState,
  reducers: {
    showTradeInDescription: (state) => {
      state.isOpenTradeIn = !state.isOpenTradeIn;  
    },
  },
});

export const { showTradeInDescription } = showTradeInSlice.actions;

export default showTradeInSlice.reducer;
