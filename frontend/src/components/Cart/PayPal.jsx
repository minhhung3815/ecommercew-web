import { useSnackbar } from "notistack";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emptyCart } from "../../actions/cartAction";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const PayPal = ({ paymentData, order, paymentInfo }) => {
  // console.log("1:", paymentData, "2: ", order, "3: ", paymentInfo);
  const payment = { ...paymentData };
  const makeOrder = { ...order, paymentInfo: payment };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const enqueueSnackbar = useSnackbar();
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AcMTbkZcKG_TMgrYXswBDclEvFQ3gIEooPjjBALWhMys8kfF7HAMyaLzLO7zkOSZggic5CkbO5jzo_c_",
      }}
    >
      <PayPalButtons
        createOrder={(data, actions, err) => {
          return actions.order.create({
            purchase_units: [
              {
                description: "PayPal",
                amount: {
                  currency_code: "USD",
                  value: payment.amount,
                },
                shipping: {
                  address: {
                    address_line_1: order.shippingInfo.address,
                    admin_area_1:
                      "P." +
                      order.shippingInfo.ward +
                      ", Q." +
                      order.shippingInfo.district,
                    admin_area_2: order.shippingInfo.city,
                    country_code: "VN",
                  },
                  name: {
                    full_name: payment.name,
                  },
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(async (details) => {
            console.log(details);
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            await axios.post(
              "/api/v1/order/new",
              {
                shippingInfo: makeOrder.shippingInfo,
                orderItems: makeOrder.orderItems,
                totalPrice: makeOrder.totalPrice,
                paymentInfo,
              },
              config
            );
            dispatch(emptyCart());
            navigate("/orders");
          });
        }}
        onError={(err) => {
          console.log(err);
          enqueueSnackbar("Payment proccess is failed", { variant: "error" });
          navigate("/");
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPal;
