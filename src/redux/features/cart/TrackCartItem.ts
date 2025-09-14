import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAggreed: false,
};

const trackCartSlice = createSlice({
  name: "trackCartItem",
  initialState,
  reducers: {
    modifiedCart: (state, action) => {
      state.isAggreed = !state.isAggreed;
    },
  },
});

export const { modifiedCart } = trackCartSlice.actions;

export default trackCartSlice.reducer;
