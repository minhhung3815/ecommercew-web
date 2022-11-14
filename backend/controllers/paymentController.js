const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paytm = require("paytmchecksum");
const https = require("https");
const Payment = require("../models/paymentModel");
const ErrorHandler = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AcMTbkZcKG_TMgrYXswBDclEvFQ3gIEooPjjBALWhMys8kfF7HAMyaLzLO7zkOSZggic5CkbO5jzo_c_",
  client_secret:
    "EJ1O1lf87aJTz0oRZHxklwqUp5Oq6-yP6Qc4RrfNn_T0u_0reIMEk4irlpQ4OMmgXmRBwJL8CkT_bhKu",
});

// Process Payment
exports.processPayment = asyncErrorHandler(async (req, res, next) => {
  console.log(req.payment)
  res.status(200).json({
    success: true,
  });
});

// Paytm Callback
exports.paytmResponse = (req, res, next) => {
  // console.log(req.body);

  let paytmChecksum = req.body.CHECKSUMHASH;
  delete req.body.CHECKSUMHASH;

  let isVerifySignature = paytm.verifySignature(
    req.body,
    process.env.PAYTM_MERCHANT_KEY,
    paytmChecksum
  );
  if (isVerifySignature) {
    // console.log("Checksum Matched");

    var paytmParams = {};

    paytmParams.body = {
      mid: req.body.MID,
      orderId: req.body.ORDERID,
    };

    paytm
      .generateSignature(
        JSON.stringify(paytmParams.body),
        process.env.PAYTM_MERCHANT_KEY
      )
      .then(function (checksum) {
        paytmParams.head = {
          signature: checksum,
        };

        /* prepare JSON string for request */
        var post_data = JSON.stringify(paytmParams);

        var options = {
          /* for Staging */
          hostname: "securegw-stage.paytm.in",
          /* for Production */
          // hostname: 'securegw.paytm.in',
          port: 443,
          path: "/v3/order/status",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": post_data.length,
          },
        };

        // Set up the request
        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });

          post_res.on("end", function () {
            let { body } = JSON.parse(response);
            // let status = body.resultInfo.resultStatus;
            // res.json(body);
            addPayment(body);
            // res.redirect(`${req.protocol}://${req.get("host")}/order/${body.orderId}`)
            res.redirect(`https://${req.get("host")}/order/${body.orderId}`);
          });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
      });
  } else {
    console.log("Checksum Mismatched");
  }
};

const addPayment = async (data) => {
  try {
    await Payment.create(data);
  } catch (error) {
    console.log("Payment Failed!");
  }
};

exports.getPaymentStatus = asyncErrorHandler(async (req, res, next) => {
  const payment = await Payment.findOne({ orderId: req.params.id });

  if (!payment) {
    return next(new ErrorHandler("Payment Details Not Found", 404));
  }

  const txn = {
    // id: payment.txnId,
    // status: payment.resultInfo.resultStatus,
    id: 2,
    status: "success",
  };

  res.status(200).json({
    success: true,
    txn,
  });
});
