import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TradeInDetails {
  condition: string;
  technicalDefects: string;
  accessories: string;
  memory?: string;
  controllerCount?: number;
  box?: string;
  [key: string]: any;
}

export interface TradeInItem {
  productName: string;
  imagePath: string;
  details: TradeInDetails;
}

export interface ModalTradeInDataState {
  modalTradeInData: TradeInItem | null;
}

const initialState: ModalTradeInDataState = {
  modalTradeInData: null,
};

const modalTradeInDataSlice = createSlice({
  name: "modalTradeInData",
  initialState,
  reducers: {
    addModalTradeInData: (state, action: PayloadAction<TradeInItem>) => {
      state.modalTradeInData = action.payload;
    },
    clearTradeInItemDetails: (state) => {
      state.modalTradeInData = null;
    },
  },
});

export const { addModalTradeInData, clearTradeInItemDetails } =
  modalTradeInDataSlice.actions;

export default modalTradeInDataSlice.reducer;
