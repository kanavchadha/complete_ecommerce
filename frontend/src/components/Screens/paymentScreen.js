import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { savePayment } from '../../actions/cartActions';
import CheckoutSteps from '../checkout/checkoutSteps';

function PaymentScreen(props) {
  const [paymentMethod, setPaymentMethod] = useState('');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePayment({ paymentMethod }));
    props.history.push('placeorder');
  };
  return (
    <div>
      <CheckoutSteps curr={2}></CheckoutSteps>
      <div className="form">
        <form onSubmit={submitHandler}>
          <ul className="form-container">
            <li>
              <h1 style={{fontWeight: 'bold'}}>Payment</h1>
            </li>
            <li>
              <div>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod1"
                  value="paypal"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{margin: '10px', fontSize: '1.25em'}}
                ></input>
                <label style={{fontSize: '1.2em'}} htmlFor="paymentMethod">Paypal</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod2"
                  value="razorpay"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{margin: '10px', fontSize: '1.25em'}}
                ></input>
                <label style={{fontSize: '1.2em'}} htmlFor="paymentMethod">Razorpay</label>
              </div>
            </li>
            <li>
              <button type="submit" className="button primary">
                Continue
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}
export default PaymentScreen;