import { useSnackbar } from "notistack";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emptyCart } from "../../actions/cartAction";
const PayPal = ({ paymentData, order, paymentInfo }) => {
  const payment = { ...paymentData };
  const makeOrder = { ...order, paymentInfo: payment };
  const paypal = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const enqueueSnackbar = useSnackbar();
  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "PayPal",
                amount: {
                  currency_code: "USD",
                  value: payment.amount,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
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
        },
        onError: (err) => {
          enqueueSnackbar("Payment proccess is failed", { variant: "error" });
          navigate("/");
        },
      })
      .render(paypal.current);
  });
  return (
    <div>
      <div ref={paypal} />
    </div>
  );
};

export default PayPal;
