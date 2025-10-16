import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ShowTradeInState {
  isTradeInActive: boolean;
  tradeInFinalValue: number;
}

const initialState: ShowTradeInState = {
  isTradeInActive: false,
  tradeInFinalValue: 0,
};

const showTradeInSlice = createSlice({
  name: "showTradeIn",
  initialState,
  reducers: {
    completeTradeInValuation: (state, action: PayloadAction<number>) => {
      state.tradeInFinalValue = action.payload;
      state.isTradeInActive = true;
    },

    resetTradeInValuation: (state) => {
      state.tradeInFinalValue = 0;
      state.isTradeInActive = false;
    },
  },
});

export const { completeTradeInValuation, resetTradeInValuation } =
  showTradeInSlice.actions;

export default showTradeInSlice.reducer;
