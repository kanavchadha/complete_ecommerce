import Axios from "axios";
import {
  ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS, ORDER_PAY_FAIL, MY_ORDER_LIST_REQUEST, MY_ORDER_LIST_SUCCESS, MY_ORDER_LIST_FAIL, ORDER_DELETE_REQUEST, ORDER_DELETE_SUCCESS, ORDER_DELETE_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL,
  ORDER_STATUS_REQUEST, ORDER_STATUS_SUCCESS, ORDER_STATUS_FAIL
} from "../constants/orderConstants";
import { GET_CART_SUCCESS } from '../constants/cartConstants'
import download from 'js-file-download';
import Cookie from 'js-cookie';

const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    const { userSignin: { userInfo } } = getState();

    const { data: { data: newOrder } } = await Axios.post("/api/orders", order, {
      headers: {
        Authorization: 'Bearer ' + userInfo.token
      }
    });
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: newOrder });
  } catch (error) {
    dispatch({ type: ORDER_CREATE_FAIL, payload: error.message });
  }
}

const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_ORDER_LIST_REQUEST });
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.get("/api/orders/mine", {
      headers:
        { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: MY_ORDER_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: MY_ORDER_LIST_FAIL, payload: error.message });
  }
}

const listOrders = () => async (dispatch, getState) => {

  try {
    dispatch({ type: ORDER_LIST_REQUEST });
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.get("/api/orders", {
      headers:
        { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: ORDER_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: ORDER_LIST_FAIL, payload: error.message });
  }
}

const detailsOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.get("/api/orders/" + orderId, {
      headers:
        { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: ORDER_DETAILS_FAIL, payload: error.message });
  }
}

const payOrder = (order, paymentResult, pm) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST, payload: paymentResult });
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.put("/api/orders/" + order._id + "/pay/" + pm, paymentResult, {
      headers:
        { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data })

    Cookie.set('cartInfo', JSON.stringify([]));
    dispatch({ type: GET_CART_SUCCESS, payload: [] });

  } catch (error) {
    dispatch({ type: ORDER_PAY_FAIL, payload: error.message });
  }
}

const orderStatus = (orderId, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_STATUS_REQUEST });
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.put("/api/orders/setstatus/" + orderId, { setStatus: status }, {
      headers: { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: ORDER_STATUS_SUCCESS, payload: data.currStatus });
  } catch (error) {
    dispatch({ type: ORDER_STATUS_FAIL, payload: error.message });
  }
}

const deleteOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.delete("/api/orders/" + orderId, {
      headers:
        { Authorization: 'Bearer ' + userInfo.token }
    });
    dispatch({ type: ORDER_DELETE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: ORDER_DELETE_FAIL, payload: error.message });
  }
}

const downloadInvoice = (orderId) => async (dispatch, getState) => {
  try {
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.get("/api/orders/download-invoice/" + orderId,
      {
        responseType: 'blob',
        headers: { Authorization: 'Bearer ' + userInfo.token }
      });
    download(data, 'invoice_'+orderId+'.pdf');
  } catch (err) {
    console.log(err);
  }
}

export { createOrder, detailsOrder, payOrder, listMyOrders, listOrders, orderStatus, deleteOrder, downloadInvoice };