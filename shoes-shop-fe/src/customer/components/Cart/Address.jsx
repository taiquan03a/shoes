import React, { useState, useEffect } from "react";
import axios from "axios";

const ProvinceSelection = (props) => {
  const host = "https://vapi.vnappmob.com/api/province";
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    // Call API to get list of provinces
    axios
      .get(`${host}`)
      .then((response) => setCities(
        //response.data.province_name
        response.data.results
      ))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  const callApiDistrict = (cityCode) => {
    // Call API to get list of districts based on selected city
    axios
      .get(`${host}/district/${cityCode}`)
      .then((response) => setDistricts(response.data.results))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const callApiWard = (districtCode) => {
    // Call API to get list of wards based on selected district
    axios
      .get(`${host}/ward/${districtCode}`)
      .then((response) => setWards(response.data.results))
      .catch((error) => console.error("Error fetching wards:", error));
  };
  const cityOptions = [];
  for (const city of cities) {
    cityOptions.push(
      <option key={city.province_id} value={city.province_id}>
        {city.province_name}
      </option>
    );
  }
  const districtOptions = [];
  for (const district of districts) {
    districtOptions.push(
      <option key={district.district_id} value={district.district_id}>
        {district.district_name}
      </option>
    );
  }
  const wardOptions = [];
  for (const ward of wards) {
    wardOptions.push(
      <option key={ward.ward_id} value={ward.ward_name}>
        {ward.ward_name}
      </option>
    );
  }
  const handleCityChange = (event) => {
    const selectedCityCode = event.target.value;
    props.setState((s) => ({
      ...s,
      city: cities.find(
        (city) => city.province_id === selectedCityCode)?.province_name,
      district: "",
      ward: "",
      address: "",
    }));
    setSelectedCity(selectedCityCode);
    setSelectedDistrict("");
    setSelectedWard("");
    callApiDistrict(selectedCityCode);
    console.log(props.state.city)
  };

  const handleDistrictChange = (event) => {
    const selectedDistrictCode = event.target.value;
    props.setState((s) => ({
      ...s,
      district: districts.find(
        (district) => district.district_id === selectedDistrictCode)?.district_name,
      ward: "",
      address: "",
    }));
    setSelectedDistrict(selectedDistrictCode);
    setSelectedWard("");
    callApiWard(selectedDistrictCode);
  };

  const handleWardChange = (event) => {
    console.log(event.target.key)
    console.log(event.target.value)
    props.setState((s) => ({
      ...s,
      ward: event.target.value,
      address: "",
    }));
    setSelectedWard(event.target.value);
  };

  const handleAddressChange = (event) => {
    const addressValue = event.target.value;
    props.setState((s) => ({
      ...s,
      address: addressValue,
    }));
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ marginBottom: "10px" }}>
        <span style={{ marginRight: "32px" }}>Tỉnh/Thành:</span>
        <select
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          style={{
            border: "1px solid",
            borderRadius: "14px",
            height: "32px",
            width: "180px",
          }}
        >
          <option value="" disabled>
            Chọn tỉnh thành
          </option>
          {cityOptions}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <span style={{ marginRight: "23px" }}>Quận/Huyện:</span>
        <select
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          style={{
            border: "1px solid",
            borderRadius: "14px",
            height: "32px",
            width: "180px",
          }}
        >
          <option value="" disabled>
            Chọn quận huyện
          </option>
          {districtOptions}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <span style={{ marginRight: "32px" }}>Phường/Xã:</span>
        <select
          id="ward"
          value={selectedWard}
          onChange={handleWardChange}
          style={{
            border: "1px solid",
            borderRadius: "14px",
            height: "32px",
            width: "180px",
          }}
        >
          <option value="" disabled>
            Chọn phường xã
          </option>
          {wardOptions}
        </select>
      </div>

      <div>
        <span style={{ marginRight: "57px" }}>Số nhà:</span>
        <input
          type="text"
          id="address"
          value={props.state.address}
          onChange={handleAddressChange}
          placeholder="Địa chỉ"
          style={{
            border: "1px solid",
            borderRadius: "14px",
            height: "32px",
            width: "60%",
            paddingLeft: "10px",
          }}
        />
      </div>
    </div>
  );
};

export default ProvinceSelection;
