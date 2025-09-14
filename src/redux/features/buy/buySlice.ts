import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
    modal: string
    controller: string | number
    memory: string
    conditions: string,
    price:  number
}

const initialState : ModalState= {
  modal: "",
  controller:1,
  memory: "",
  conditions: "", 
  price: 0
};

const buySlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    addProductFeature: (state) => {
      
    },
  },
});

export const { addProductFeature } = buySlice.actions;

export default buySlice.reducer;