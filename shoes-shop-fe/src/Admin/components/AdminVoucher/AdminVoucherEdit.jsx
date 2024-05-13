import React, { useEffect, useState } from "react";
import { WrapperHeader, WrapperSubHeader } from "./style";
import InputField from "../../../customer/components/InputField";
import Group from "../AdminProduct/Group";
import GroupVariation from "../AdminProduct/GroupVariation";
import { Button, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as VoucherService from "../../../services/VoucherService";

import MultilevelDropdown from "../MultilevelDropdown/MultilevelDropdown";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import axios from "axios";
import * as AuthService from "../../../services/AuthService";
import CustomInput from "../../../customer/components/CKEditor/customInput";

const AdminVoucherEdit = (props) => {
  const dispatch = useDispatch();
  let voucherDetail = useSelector(
    (state) => state.product.productDetail.currentProduct
  );
  const auth = useSelector((state) => state.auth.login.currentUser);

  const [voucherName, setVoucherName] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherType, setVoucherType] = useState("");
  const [discount, setDiscount] = useState();
  const [minOrder, setMinOrder] = useState();
  const [maxUse, setMaxUse] = useState();
  const [userUse, setUserUse] = useState();
  const [begin, setBegin] = useState("");
  const [end, setEnd] = useState("");

  const [dataAPICreate, setDataAPICreate] = useState(null);

  useEffect(() => {
    setVoucherName(voucherDetail.name);
    setVoucherCode(voucherDetail.code);
    setVoucherType(voucherDetail.type);
    setDiscount(voucherDetail.discount);
    setMinOrder(voucherDetail.minOder);
    setUserUse(voucherDetail.userUse);
    setMaxUse(voucherDetail.maxUse);
    setBegin(voucherDetail.begin);
    setEnd(voucherDetail.end);
  }, [voucherDetail]);


  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      // console.log("data", data);
      return data?.accessToken;
    } catch (err) {
      console.log("err", err);
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      if (auth?.accessToken) {
        const decodAccessToken = jwtDecode(auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const data = await refreshToken();
          const refreshUser = {
            ...auth,
            accessToken: data,
          };

          console.log("data in axiosJWT", data);
          // console.log("refreshUser", refreshUser);

          dispatch(loginSuccess(refreshUser));
          config.headers["Authorization"] = `Bearer ${data}`;
        }
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const mutation = useMutationHook((id,data) => {
    console.log(id);
    const res = VoucherService.editVoucher(id,data, auth.accessToken, axiosJWT);
    return res;
  });
  const {data, status, isSuccess, isError } = mutation;

  const handleCreateProductClick = () => {
    
    const voucherCreateRequest = {
        //id: voucherDetail?.id,
        active: voucherDetail?.active,
        name: voucherName,
        code: voucherCode,
        type: voucherType,
        discount : discount,
        minOder : minOrder,
        maxUse : maxUse,
        userUse :userUse,
        begin : begin,
        end : end,
    };

    const apiPayload = {
        ...voucherCreateRequest,
    };

    setDataAPICreate(apiPayload);

    mutation.mutate(voucherDetail?.id,apiPayload, {
        onSuccess: () => {
        message.success("Chỉnh sửa sản phẩm thành công");
        props.setIsModalOpen(false);

        setTimeout(() => {
            window.location.reload();
        }, 1000);
        },
        onError: (error) => {
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        props.setIsModalOpen(false);
        },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <WrapperHeader style={{ paddingLeft: "20px" }}>
        Thêm Sản phẩm
      </WrapperHeader>,
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            margin: "16px 20px",
            padding: "10px 16px",
            border: "1px solid",
            borderRadius: "10px",
          }}
        >
          <WrapperSubHeader>Thông tin cơ bản</WrapperSubHeader>
          <Group
            title={"Tên chương trình"}
            onDataChange={setVoucherName}
            dataDetail={voucherName}
          />
          <Group
            title={"Mã khuyến mãi"}
            onDataChange={setVoucherCode}
            dataDetail={voucherCode}
          />
          <Group
            title={"Kiểu khuyến mãi"}
            onDataChange={setVoucherType}
            dataDetail={voucherType}
          />
          <Group
            title={"Mức giảm"}
            onDataChange={setDiscount}
            dataDetail={discount}
          />
          <Group
            title={"Giá trị đơn hàng tối thiểu"}
            onDataChange={setMinOrder}
            dataDetail={minOrder}
          />
          <Group
            title={"Số lượt dùng/khác hàng"}
            onDataChange={setMaxUse}
            dataDetail={userUse}
          />
          <Group
            title={"Số lượt dùng tối đa"}
            onDataChange={setMaxUse}
            dataDetail={maxUse}
          />
          <Group
            title={"Ngày bắt đầu"}
            onDataChange={setBegin}
            dataDetail={begin}
          />
          <Group
            title={"Nfgày kết thúc"}
            onDataChange={setEnd}
            dataDetail={end}
          />
        </div>
      </div>

      <Button
        style={{
          alignSelf: "flex-end", // Đặt nút ở phía bên phải
          margin: "0 20px 10px 0",
          backgroundColor: "red",
          color: "#fff",
          fontWeight: "bold",
          height: "56px",
        }}
        onClick={handleCreateProductClick}
      >
        <p>Tiến hành chỉnh sửa</p>
      </Button>
    </div>
  );
};

export default AdminVoucherEdit;
