import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeCartItem } from '../../actions/cartActions';
import Spinner from '../spinner/spinner';
import { Popconfirm,message } from 'antd';

const CartScreen = (props) => {

    const { loading, error, cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const removeFromCart = (prodId) => {
        dispatch(removeCartItem(prodId));
    }
    const checkoutHandler = () => {
        props.history.push('/signin?redirect=shipping');
    }

    function cancel(e) {
        message.error('Click on No');
    }
    return (
        <div className="cart">
            {loading ? <Spinner /> : error ? <div>{error}</div> : (
                <div className="cart-list">
                    <ul className="cart-list-container">
                        <li>
                            <h1>  Shopping Cart </h1>
                            <div> Price </div>
                        </li>
                        {
                            cartItems.length === 0 ? <div> Cart is empty <img className="emptycart" src="https://i.postimg.cc/3JQ6zKtD/empty-cart.png" alt="pic" /> </div> : (
                                cartItems.map(item =>
                                    <li key={item._id}>
                                        <div className="cart-image">
                                            <img src={item.product.image[0]} alt="product" />
                                        </div>
                                        <div className="cart-name">
                                            <Link to={"/products/" + item.product._id}>
                                                {item.product.name}
                                            </Link>
                                        </div>
                                        <div className="cart-qty">
                                            <span> <b style={{ color: 'rgb(3, 24, 70)' }}>Qty: </b>
                                                <select value={item.qty} onChange={(e) => dispatch(addToCart(item.product._id, e.target.value))} style={{fontSize: '0.8em'}}>
                                                    {[...Array(item.product.countInStock).keys()].map(x =>
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    )}
                                                </select>
                                            </span>
                                            <Popconfirm
                                                title="Are you sure delete this Product?"
                                                onConfirm={() => removeFromCart(item.product._id)}
                                                onCancel={cancel}
                                                okText="Delete"
                                                cancelText="Cancel">
                                                <button type="button" className="delItem">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </Popconfirm>
                                            
                                        </div>

                                        <div className="cart-price"> ${item.product.price} </div>
                                    </li>)
                            )}
                    </ul>
                </div>
            )}
            {loading ? <div>.</div> : error ? <div>{' '}</div> : (
                <div className="cart-action">
                    <h3 className="centered">
                        Subtotal : ( {cartItems.reduce((a, c) => a + Number(c.qty), 0)} items)
          <i style={{ paddingLeft: '5px' }} className="fa fa-inr"></i>{cartItems.reduce((a, c) => a + c.product.price * c.qty, 0).toFixed(2)}
                    </h3>
                    <button className="primary mbt" disabled={cartItems.length === 0} onClick={checkoutHandler}>
                        Proceed to Checkout
                    </button>
                </div>
            )}

        </div>
    )
}

export default CartScreen;