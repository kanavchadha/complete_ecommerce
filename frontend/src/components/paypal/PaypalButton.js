// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import axios from 'axios';

// const  PaypalButton = (props)=>{
//   const [sdkReady, setSdkReady] = useState(false);

//   const addPaypalSdk = async () => {
//     const result = await axios.get("/api/paypal/cid");
//     const clientID = result.data;
//     const script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = 'https://www.paypal.com/sdk/js?client-id=' + clientID;
//     script.async = true;
//     script.onload = () => {
//       setSdkReady(true);
//     }
//     script.onerror = ()=>{
//       setSdkReady(false);
//     }
//     document.body.appendChild(script);
//   }

//   const createOrder = (data, actions) => actions.order.create({
//     purchase_units: [
//       {
//         amount: {
//           currency_code: 'INR',
//           value: props.amount
//         }
//       }
//     ]
//   });

//   const onApprove = (data, actions) => actions.order
//     .capture()
//     .then(details => props.onSuccess(data, details))
//     .catch(err => console.log(err));

//   useEffect(() => {
//     if (!window.paypal) {
//       addPaypalSdk();
//     }
//     return ()=>{
      
//     }
//   }, []);

//   if (!sdkReady) {
//     return <div>Loading...</div>
//   }

//   const Button = window.paypal.Buttons.driver('react', { React, ReactDOM });

//   return <Button {...props} createOrder={(data, actions) => createOrder(data, actions)}
//     onApprove={(data, actions) => onApprove(data, actions)} />
// }

// export default PaypalButton;

import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
 
class PaypalButton extends React.Component {
    render() {
        // const onSuccess = (payment) => {
        //     // Congratulation, it came here means everything's fine!
        //     		console.log("The payment was succeeded!", payment);
        //     		// You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
        // }
 
        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
            console.log('The payment was cancelled!', data);
            // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
        }
 
        const onError = (err) => {
            // The main Paypal's script cannot be loaded or somethings block the loading of that script!
            console.log("Error!", err);
            // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
            // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
        }
 
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'INR'; // or you can set this value from your props or state
        let total = Math.ceil(this.props.amount); // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/
 
        const client = {
            sandbox:    'ATv603JiK5dhBrvvVDyu4ZDpycJVm1Yx4ZahZcBzBp1pQtZYwPP-3GXppcyG11hCXrm-dNJ9JtRSH8CN',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        // In order to get production's app-ID, you will have to send your app to Paypal for approval first
        // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
        //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
        // For production app-ID:
        //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/
 
        // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
        return (
            <PaypalExpressBtn env={env}
             client={client}
             currency={currency}
             total={total}
             onError={onError}
             onSuccess={this.props.onSuccess}
             onCancel={onCancel}
             style={{size: 'large',color: 'blue', shape: 'rect', label: 'checkout'}} 
            />
        );
    }
}

export default PaypalButton;