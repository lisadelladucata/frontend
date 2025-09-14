import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterableProductType: [],
};

const productTypeSlice = createSlice({
  name: "productType",
  initialState,
  reducers: {
    addProductType: (state, action) => {
      state.filterableProductType = action.payload;
    },
  },
});

export const { addProductType } = productTypeSlice.actions;
export default productTypeSlice.reducer;
