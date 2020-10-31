import {createStore,combineReducers, applyMiddleware,compose} from 'redux';
import { productListReducer,productDetailsReducer, productSaveReducer, productDeleteReducer, productReviewSaveReducer } from './reducers/product';
import {cartReducer} from './reducers/cartReducers';
import {userSigninReducer,userRegisterReducer, userUpdateReducer} from './reducers/userReducers';
import thunk from 'redux-thunk';
import Cookie from 'js-cookie';
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, myOrderListReducer, orderListReducer, orderStatusReducer,orderDeleteReducer } from './reducers/orderReducers';

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
    userUpdate: userUpdateReducer,
    productSave: productSaveReducer,
    productDelete: productDeleteReducer,
    productReviewSave: productReviewSaveReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    myOrderList: myOrderListReducer,
    orderList: orderListReducer,
    orderStatus: orderStatusReducer,
    orderDelete: orderDeleteReducer,
})

const cartItems = Cookie.getJSON('cartInfo') || [];
const userInfo = Cookie.getJSON('userInfo') || null
const initState={ cart: {cartItems: cartItems,shipping: {},payment: {}},userSignin: { userInfo } };

const composeEnhancer =  process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
const store = createStore(reducer,initState,composeEnhancer(applyMiddleware(thunk)));

export default store;