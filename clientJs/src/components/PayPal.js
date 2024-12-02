import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export const PayPal = ({ total }) => {
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toFixed(2), // Convert total to string with 2 decimal places
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    // Capture the funds from the transaction
    return actions.order.capture().then(function (details) {
      // The payment was successful, you can now update your UI or take any further actions
      console.log("Payment successful", details);
    });
  };

  return (
    <div>
      <PayPalScriptProvider
        options={{
          "client-id":
            "AVj_d9cYvYjkA2EZWif5Bv9yW-bvZmCFSbAkbQ2EQqFLy45fg1YysP7xxZmy2JL4Lur64i-LgoNjD3cm",
        }}
      >
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      </PayPalScriptProvider>
    </div>
  );
};
