import { createSlice } from "@reduxjs/toolkit";

export const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    voucherDetail: {
      currentVoucher: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    updateVoucherDetail: (state, action) => {
      state.voucherDetail.currentVoucher = action.payload;
      state.voucherDetail.isFetching = false;
      state.voucherDetail.error = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateVoucherDetail } = voucherSlice.actions;

export default voucherSlice.reducer;
