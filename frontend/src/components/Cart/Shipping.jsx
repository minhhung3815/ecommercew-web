import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PriceSidebar from "./PriceSidebar";
import Stepper from "./Stepper";
import { useSnackbar } from "notistack";
import { saveShippingInfo } from "../../actions/cartAction";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layouts/MetaData";
import states from "../../utils/states";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { cartItems } = useSelector((state) => state.cart);
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [deliverdBy, setDeliveredBy] = useState(shippingInfo.deliverdBy);
  const [district, setDistrict] = useState(shippingInfo.district);
  const [ward, setWard] = useState(shippingInfo.ward);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [charges, setCharges] = useState(shippingInfo.charges);
  const setPrice = (method) => {
    const charges = method === "normal" ? 0 : 50;
    console.log(typeof fee)
    dispatch(
      saveShippingInfo({
        address,
        city,
        deliverdBy,
        district,
        ward,
        phoneNo,
        charges,
      })
    );
  };
  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 10 || phoneNo.length > 10) {
      enqueueSnackbar("Invalid Phone Number", { variant: "error" });
      return;
    }
    dispatch(
      saveShippingInfo({
        address,
        city,
        deliverdBy,
        district,
        ward,
        phoneNo,
        charges,
      })
    );
    navigate("/order/confirm");
  };

  return (
    <>
      <MetaData title="Flipkart: Shipping Details" />
      <main className="w-full mt-20">
        {/* <!-- row --> */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7 overflow-hidden">
          {/* <!-- cart column --> */}
          <div className="flex-1">
            <Stepper activeStep={1}>
              <div className="w-full bg-white">
                <form
                  onSubmit={shippingSubmit}
                  autoComplete="off"
                  className="flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-1 sm:mx-8 my-4"
                >
                  <TextField
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                    label="Address"
                    variant="outlined"
                    required
                  />

                  <div className="flex gap-6">
                    <TextField
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      label="Ward"
                      fullWidth
                      variant="outlined"
                      required
                    />
                    <TextField
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                      }}
                      label="District"
                      fullWidth
                      variant="outlined"
                      required
                    />
                  </div>

                  <div className="flex gap-6">
                    <FormControl fullWidth>
                      <InputLabel id="state-select">City</InputLabel>
                      <Select
                        labelId="state-select"
                        id="state-select"
                        value={city}
                        label="State"
                        onChange={(e) => setCity(e.target.value)}
                        required
                      >
                        {states.map((item) => (
                          <MenuItem key={item.code} value={item.code}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      type="tel"
                      label="Phone No"
                      fullWidth
                      variant="outlined"
                      required
                    />
                  </div>

                  <div className="flex gap-6">
                    <FormControl fullWidth>
                      <InputLabel id="country-select">
                        Deliver Options
                      </InputLabel>
                      <Select
                        labelId="country-select"
                        id="country-select"
                        value={deliverdBy}
                        label="Country"
                        onChange={(e) => {
                          console.log(e.target.value);
                          setDeliveredBy(e.target.value);
                          e.target.value === "normal"
                            ? setCharges(0)
                            : setCharges(50);
                          setPrice(e.target.value);
                        }}
                        // onClick={() => {
                        //   setPrice();
                        // }}
                      >
                        <MenuItem value={"normal"}>Normal Deliver</MenuItem>
                        <MenuItem value={"fast"}>Fast Deliver</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      value={deliverdBy === "normal" ? 0 : 50}
                      label="Delivery Charges"
                      fullWidth
                      variant="outlined"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-primary-orange w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none"
                  >
                    save and deliver here
                  </button>
                </form>
              </div>
            </Stepper>
          </div>

          <PriceSidebar cartItems={cartItems} shippingInfo={shippingInfo} />
        </div>
      </main>
    </>
  );
};

export default Shipping;
