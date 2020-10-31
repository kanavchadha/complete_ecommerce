import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsOrder, payOrder } from '../../actions/orderActions';
import PaypalButton from '../../components/paypal/PaypalButton';
import TrackOrder from './trackOrder';
import Spinner from '../spinner/spinner';
import { Alert,message } from 'antd';

const OrderScreen = (props) => {
  const [trackOrder, setTrackOrder] = useState(false);

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const orderPay = useSelector(state => state.orderPay);
  const { loading: loadingPay, success: successPay, error: errorPay } = orderPay;

  const orderDetails = useSelector(state => state.orderDetails);
  const { loading, order, error } = orderDetails;
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailsOrder(props.match.params.id));
  }, [successPay]);


  const openTrackOrder = ()=>{
    setTrackOrder(true) 
  }
  const closeTrackOrder = ()=>{
    setTrackOrder(false) 
  }

  const handleSuccessPayment = (paymentResult) => {
    dispatch(payOrder(order, paymentResult, 'paypal'));
    message.success(`Congratulations! ${userInfo.name}, Your Order Has Successfully Placed.`);
  }

  const displayRazorPay = async () => {
    const res = await paymentRazorPay();
    if (!res) {
      alert("Something went Wrong! Check your internet connection.");
    }
    const { data } = await Axios.post('/razorpay', {
      totalPrice: order.totalPrice
    });
    console.log(data);
    var options = {
      "key": data.razorpay_key.toString(),
      "currency": data.currency.toString(),
      "amount": data.amount.toString(),
      "order_id": data.id.toString(),
      "name": "kanav E-commerce",
      "description": "thank you for shopping!",
      "image": "https://penji.co/wp-content/uploads/2019/06/amazon-ecommerce-logo.jpg",
      "handler": function (response) {
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature)
        const paymentResult = {
          payerID: response.razorpay_signature,
          orderID: response.razorpay_order_id,
          paymentID: response.razorpay_payment_id
        }
        dispatch(payOrder(order, paymentResult, 'razorpay'));
        message.success(`Congratulations! ${userInfo.name}, Your Order Has Successfully Placed.`);
      },
      "prefill": {
        "name": userInfo.name,
        "email": userInfo.email,
      },
      "theme": {
        "color": "#1d346b"
      }
    };
    var paymentObj = new window.Razorpay(options);
    paymentObj.open();
  }
  const paymentRazorPay = () => {
    const promise = new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      }
      script.onerror = () => {
        resolve(false);
      }
      document.body.appendChild(script);
    })
    return promise;
  }

  return loading ? <Spinner /> : error ? <Alert message={error} type="error" showIcon /> :

    <div>
      <div className="placeorder">
        <div className="placeorder-info">
          <div>
            <h3>
              Shipping
          </h3>
            <div>
              {order.shipping.address}, {order.shipping.city},
          {order.shipping.postalCode}, {order.shipping.country},
          </div>
            <div>
              {order.isDelivered ? "Delivered at " + order.deliveredAt : "Not Delivered."}
            </div>
          </div>
          <div>
            <h3>Payment</h3>
            <div>
              Payment Method: {order.payment.paymentMethod}
            </div>
            <div>
              {order.isPaid ? "Paid at " + order.paidAt : "Not Paid."}
            </div>
          </div>
          <div>
            <ul className="cart-list-container">
              <li>
                <h3>
                  Shopping Cart
          </h3>
                <div>
                  Price
          </div>
              </li>
              {
                order.orderItems.length === 0 ?
                  <div>
                    Cart is empty
          </div>
                  :
                  order.orderItems.map(item =>
                    <li key={item.product._id}>
                      <div className="cart-image">
                        <img src={item.product.image[0]} alt="product" />
                      </div>
                      <div className="cart-name">
                        <div>
                          <Link to={"/products/" + item.product._id}>
                            {item.product.name}
                          </Link>
                        </div>
                      </div>
                      <div className="cart-qty">
                        Qty: {item.qty}
                      </div>
                      <div className="cart-price">
                        ${item.product.price}
                      </div>
                    </li>
                  )
              }
            </ul>
          </div>


        </div>
        <div className="placeorder-action">
          <ul>
            <li className="placeorder-actions-payment">
              {loadingPay && <div>Finishing Payment...</div>}
              {!order.isPaid &&
                <PaypalButton
                  amount={order.totalPrice}
                  onSuccess={handleSuccessPayment} />
              }
            </li>
            <li>
              {!order.isPaid &&
                <button onClick={displayRazorPay} style={{ width: '100%', backgroundColor: '#1c8fd6', outline: 'none', borderRadius: '5px', border: '1px solid rgb(43, 97, 212)', color: 'white', padding: '8px', fontSize: '1.2em', cursor: 'pointer', boxShadow: '0 5px 10px rgba(0,0,0,0.3)' }}> <b>RazorPay</b> checkout</button>
              }
            </li>
            <li>
              <h3>Order Summary</h3>
            </li>
            <li>
              <div>Items</div>
              <div>$ {order.itemsPrice ? order.itemsPrice.toFixed(2) : ''}</div>
            </li>
            <li>
              <div>Shipping</div>
              <div>$ {order.shippingPrice ? order.shippingPrice.toFixed(2) : '0'}</div>
            </li>
            <li>
              <div>Tax</div>
              <div>$ {order.taxPrice ? order.taxPrice.toFixed(2) : '0'}</div>
            </li>
            <li>
              <div>Order Total</div>
              <div>$ {order.totalPrice ? order.totalPrice.toFixed(2) : ''}</div>
            </li>
          </ul>

          <div className="trackOrder">
            <h2>Track Your Order: </h2>
            <div>
              {order.isPaid ?
                <button onClick={openTrackOrder}>Track-Order</button>
                : <h3 style={{ border: '1px solid #808080', padding: '5px 10px', textAlign: 'center' }}>Track-Order</h3>
              }
            </div>
              <TrackOrder status={order.status} visible={trackOrder} closeModal={closeTrackOrder} />
          </div>

        </div>
      </div>
    </div>
}

export default OrderScreen;