import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING, GET_CART_REQ, GET_CART_SUCCESS, GET_CART_FAIL, CART_SAVE_PAYMENT } from '../constants/cartConstants';

const cartReducer = (state = { cartItems: [], shipping: {}, payment: {} }, action) => {
    switch (action.type) {
        case GET_CART_REQ:
            return {loading: true}
        case GET_CART_SUCCESS:
            console.log(action.payload)
            return {loading: false, cartItems: [...action.payload],error: null}
        case GET_CART_FAIL:
            return {loading: false, error: action.payload}
        case CART_SAVE_SHIPPING:
            return {
                ...state, shipping: action.payload
            }
        case CART_SAVE_PAYMENT:
            return {
                ...state, payment: action.payload
            }
        default:
            return state;
    }
}

export { cartReducer };