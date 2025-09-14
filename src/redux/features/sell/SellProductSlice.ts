import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: number;
  selectedConsole: string;
}

interface SellProductState {
  products: Product[];
}

const initialState: SellProductState = {
  products: [],
};

const sellProductSlice = createSlice({
  name: "sellProduct",
  initialState,
  reducers: {
    addSelectedSellProduct: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.products.find((p) => p.id === action.payload.id);

      if (existingProduct) {
        existingProduct.selectedConsole = action.payload.selectedConsole;
      } else {
        console.log(action.payload)
        state.products.push(action.payload);
      }
    },
  },
});

export const { addSelectedSellProduct } = sellProductSlice.actions;
export default sellProductSlice.reducer;
