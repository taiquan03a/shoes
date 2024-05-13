import axios from "axios";

const axiosJWT = axios.create();

export const getAllVoucherAdmin = async (accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}admin/vouchers`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
export const getDiscount = async (params) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}voucher/getDiscount`, {
    params,
  });
  return res.data;
};
export const calculate = async (params) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}voucher/calculate`, {
    params,
  });
  return res.data;
};
export const createVoucher = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}voucher/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
export const editVoucher = async (id,data, accessToken, axiosJWT) => {
  console.log("data", data);
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}voucher/edit/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
export const changeStatusVoucher = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}voucher/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
export const getDetailVoucherForAdmin = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}admin/vouchers/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};