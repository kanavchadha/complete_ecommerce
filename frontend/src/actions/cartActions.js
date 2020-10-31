import { CART_SAVE_SHIPPING, CART_SAVE_PAYMENT, GET_CART_REQ, GET_CART_SUCCESS, GET_CART_FAIL } from '../constants/cartConstants';
import Cookie from 'js-cookie';
import axios from 'axios';

const addToCart = (prodId, qty) =>
    async (dispatch, getState) => {
        try {
            dispatch({type: GET_CART_REQ});
            const { userSignin: { userInfo } } = getState();
            const { data } = await axios.post('/api/users/addtocart/' + prodId, { qty }, {
                headers: {
                    Authorization: 'Bearer ' + userInfo.token
                }
            });
            Cookie.set('cartInfo', JSON.stringify(data.data));
            dispatch({
                type: GET_CART_SUCCESS,
                payload: data.data
            });

        } catch (err) {
            console.log(err.message);
            dispatch({type: GET_CART_FAIL, payload: err.message});
        }
    }


const removeCartItem = (prodId) =>
    async (dispatch, getState) => {
        try {
            dispatch({type: GET_CART_REQ});
            const { userSignin: { userInfo } } = getState();
            const { data } = await axios.delete('/api/users/delfromcart/' + prodId, {
                headers: {
                    Authorization: 'Bearer ' + userInfo.token
                }
            });
            Cookie.set('cartInfo', JSON.stringify(data.data));
            dispatch({
                type: GET_CART_SUCCESS,
                payload: data.data
            });

        } catch (err) {
            console.log(err.message);
            dispatch({type: GET_CART_FAIL, payload: err.message});
        }
    }

const saveShipping = (data) => (dispatch) => {
    dispatch({ type: CART_SAVE_SHIPPING, payload: data });
}

const savePayment = (data) => (dispatch) => {
    dispatch({ type: CART_SAVE_PAYMENT, payload: data });
}

export { addToCart, removeCartItem, saveShipping, savePayment };