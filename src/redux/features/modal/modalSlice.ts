import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
    modal: boolean
}

const initialState : ModalState= {
  modal: false,
}; 

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.modal = !state.modal;  
    },
  },
}); 
 
export const { toggleModal } = modalSlice.actions;

export default modalSlice.reducer;
