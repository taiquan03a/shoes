import React, { useState } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import { useDispatch, useSelector } from "react-redux";

// import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Modal, message } from "antd";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as VoucherService from "../../../services/VoucherService";
import AdminVoucherEdit from "./AdminVoucherEdit";
import { updateVoucherDetail } from "../../../redux/slides/voucherSlide";
import { updateProductDetail } from "../../../redux/slides/productSlice";
import { useQuery } from "@tanstack/react-query";
// import {} from "icons"
import { Popover } from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import * as AuthService from "../../../services/AuthService";

const AdminVoucher = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();

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

  const getAllVoucherAdmin = async () => {
    const res = await VoucherService.getAllVoucherAdmin(auth.accessToken, axiosJWT);
    console.log(res);
    return res;
  };
  const { data: vouchers, refetch } = useQuery({
    queryKey: ["vouchers"],
    queryFn: getAllVoucherAdmin,
    enabled: Boolean(auth?.accessToken),
  });
  const mutation = useMutationHook((data) => {
    const res = VoucherService.changeStatusVoucher(
      data,
      auth?.accessToken,
      axiosJWT
    );
    return res;
  });
  const { data, status, isSuccess, isError } = mutation;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inActiveORActive = async (id) => {
    console.log("key delete", id);

    mutation.mutate(id, {
      onSuccess: () => {
        // Hiển thị thông báo thành công
        message.success("Chỉnh sửa trạng thái thành công");
        refetch({ queryKey: ["vouchers"] });
      },
      onError: (error) => {
        // Hiển thị thông báo lỗi
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        refetch({ queryKey: ["vouchers"] });
      },
    });
  };
  const showModal = async (key) => {
    console.log("key edit", key);

    try {
      const voucherDetail = await VoucherService.getDetailVoucherForAdmin(
        key,
        auth?.accessToken,
        axiosJWT
      );
      //console.log("Detail Product Data:", voucherDetail);
      dispatch(updateProductDetail({}));
      dispatch(updateProductDetail(voucherDetail));
    } catch (error) {
      console.error("Error fetching voucher details:", error);
    }

    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const renderAction = (key, voucher) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        {voucher.active ? (
          <DeleteOutlined
            style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
            onClick={() => inActiveORActive(key)}
          />
        ) : (
          <CheckCircleOutlined
            style={{ color: "green", fontSize: "26px", cursor: "pointer" }}
            onClick={() => inActiveORActive(key)}
          />
        )}
        <EditOutlined
          style={{ color: "blue", fontSize: "26px", cursor: "pointer" }}
          onClick={() => showModal(key)}
        />
      </div>
    );
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text) => <a>{text}</a>,
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 2,
      },
    },
    {
      title: "Tên chương trình",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: {
        compare: (a, b) => a.user.localeCompare(b.user),
        multiple: 2,
      },
    },
    {
      title: "Mã khuyễn mãi",
      dataIndex: "code",
      render: (text) => <p>{text}</p>,
    },
    {
        title: "Mức giảm",
        dataIndex: "discount",
        render: (text) => (
          <p>{text}</p>
        ),
    },
    {
      title: "Giá đơn hàng tối thiểu",
      dataIndex: "minOder",
      render: (text) => (
        <p>
          {text}
        </p>
      ),
    },
    {
        title: "Đã dùng",
        dataIndex: "used",
        render: (text) => (
          <p>{text}</p>
        ),
    },
    {
        title: "Thời gian bắt đầu",
        dataIndex: "begin",
        render: (text) => (
          <p>{text}</p>
        ),
    },
    {
        title: "Thời gian kết thúc",
        dataIndex: "end",
        render: (text) => (
          <p>{text}</p>
        ),
    },
    {
      title: "Tình trạng",
      dataIndex: "active",
      render: (active) => (
        <span style={{ color: active ? "green" : "red", fontWeight: "bold" }}>
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "key",
      render: (key, voucher) => renderAction(key, voucher),
    },
];
const dataTable =
    vouchers?.length &&
    vouchers.map((voucher) => ({
        ...voucher,
        key: voucher.id,
        name: voucher.name,
        code: voucher.code,
}));
//   const renderAction = (key, status) => {
//     return (
//       <div style={{ textAlign: "center" }}>
//         <QuestionCircleOutlined
//           style={{ color: "#000", fontSize: "26px", cursor: "pointer" }}
//           onClick={() => showModal(key)}
//         />
//       </div>
//     );
//   };

  return (
    <div>
      <WrapperHeader>Quản lý Voucher</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          data={dataTable}
          columns={columns}
        />
      </div>

      <Modal
        title="Chi tiết voucher"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "red", color: "white" },
        }}
        okText="Update"
        footer={null}
        width={1000}
      >
        {isModalOpen && (
          <AdminVoucherEdit
            setIsModalOpen={setIsModalOpen}
            refetchVouchers={refetch}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminVoucher;
