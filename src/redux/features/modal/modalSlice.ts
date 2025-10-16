import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  modal: boolean;
}

const initialState: ModalState = {
  modal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.modal = !state.modal;
    },

    openModal: (state) => {
      state.modal = true;
    },
  },
});

export const { toggleModal, openModal } = modalSlice.actions;

export default modalSlice.reducer;
