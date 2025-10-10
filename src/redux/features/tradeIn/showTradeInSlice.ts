import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ShowTradeInState {
  isOpenTradeIn: boolean;
  isTradeInValuationComplete: boolean;
  tradeInFinalValue: number;
}

const initialState: ShowTradeInState = {
  isOpenTradeIn: false,
  isTradeInValuationComplete: false,
  tradeInFinalValue: 0,
};

const showTradeInSlice = createSlice({
  name: "showTradeIn",
  initialState,
  reducers: {
    toggleTradeIn: (state) => {
      state.isOpenTradeIn = !state.isOpenTradeIn;
      if (!state.isOpenTradeIn) {
        state.isTradeInValuationComplete = false;
        state.tradeInFinalValue = 0;
      }
    },

    completeTradeInValuation: (state, action: PayloadAction<number>) => {
      state.isTradeInValuationComplete = true;
      state.tradeInFinalValue = action.payload;
    },

    resetTradeInValuation: (state) => {
      state.isTradeInValuationComplete = false;
      state.tradeInFinalValue = 0;
    },
  },
});

export const {
  toggleTradeIn,
  completeTradeInValuation,
  resetTradeInValuation,
} = showTradeInSlice.actions;

export default showTradeInSlice.reducer;
