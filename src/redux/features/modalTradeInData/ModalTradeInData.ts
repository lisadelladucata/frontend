import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalTradeInData: null,
};

const modalTradeInDataSlice = createSlice({
  name: "modalTradeInData",
  initialState,
  reducers: {
    addModalTradeInData: (state, action) => {
      state.modalTradeInData = action.payload;
    },
  },
});

export default modalTradeInDataSlice.reducer;
export const { addModalTradeInData } = modalTradeInDataSlice.actions;
