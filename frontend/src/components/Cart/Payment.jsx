import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PriceSidebar from "./PriceSidebar";
import Stepper from "./Stepper";
import PayPal from "./PayPal";
import { clearErrors } from "../../actions/orderAction";
import { useSnackbar } from "notistack";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import MetaData from "../Layouts/MetaData";

const Payment = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [payDisable, setPayDisable] = useState(false);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
  const [checkout, setCheckout] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    shippingInfo.charges
  );
  const paymentData = {
    amount: Math.round(totalPrice),
    email: user.email,
    name: user.name,
    phoneNo: shippingInfo.phoneNo,
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    totalPrice,
  };

  const paymentInfo = {
    id: Math.random().toString(36).substr(2),
    status: "Processing",
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // paymentBtn.current.disabled = true;
    setPayDisable(false);

    try {
      // redirect("https://securegw-stage.paytm.in/order/process");
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const info = await axios.get(
        "/api/v1/payment/process",
        paymentData,
        config
      );
      // let info = {
      //     action: "https://securegw-stage.paytm.in/order/process",
      //     params: data.paytmParams
      // }

      // post(info)

      // if (!stripe || !elements) return;

      // const result = await stripe.confirmCardPayment(client_secret, {
      //     payment_method: {
      //         card: elements.getElement(CardNumberElement),
      //         billing_details: {
      //             name: user.name,
      //             email: user.email,
      //             address: {
      //                 line1: shippingInfo.address,
      //                 city: shippingInfo.city,
      //                 country: shippingInfo.country,
      //                 state: shippingInfo.state,
      //                 postal_code: shippingInfo.pincode,
      //             },
      //         },
      //     },
      // });

      // if (result.error) {
      //     paymentBtn.current.disabled = false;
      //     enqueueSnackbar(result.error.message, { variant: "error" });
      // } else {
      //     if (result.paymentIntent.status === "succeeded") {

      //         order.paymentInfo = {
      //             id: result.paymentIntent.id,
      //             status: result.paymentIntent.status,
      //         };

      //         dispatch(newOrder(order));
      //         dispatch(emptyCart());

      //         navigate("/order/success");
      //     } else {
      //         enqueueSnackbar("Processing Payment Failed!", { variant: "error" });
      //     }
      // }
    } catch (error) {
      // paymentBtn.current.disabled = false;
      setPayDisable(false);
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Secure Payment | PayPal" />

      <main className="w-full mt-20">
        {/* <!-- row --> */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
          {/* <!-- cart column --> */}
          <div className="flex-1">
            <Stepper activeStep={3}>
              <div className="w-full bg-white">
                <form
                  // onSubmit={(e) => submitHandler(e)}
                  autoComplete="off"
                  className="flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden"
                >
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="payment-radio-group"
                      defaultValue="paypal"
                      name="payment-radio-button"
                    >
                      <FormControlLabel
                        value="paypal"
                        control={<Radio />}
                        label={
                          <div className="flex items-center gap-4">
                            <img
                              draggable="false"
                              className="h-7 w-7 object-contain"
                              src="https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_266x142.png"
                              alt="PayPal"
                            />
                            <span>PayPal</span>
                          </div>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  {checkout ? (
                    <PayPal
                      paymentData={paymentData}
                      order={order}
                      paymentInfo={paymentInfo}
                    />
                  ) : (
                    <input
                      type="submit"
                      value={`Pay $${totalPrice.toLocaleString()}`}
                      className={`bg-primary-orange cursor-pointer w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`}
                      onClick={() => setCheckout(true)}
                    />
                  )}
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

export default Payment;
