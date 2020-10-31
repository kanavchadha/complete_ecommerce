import { PRODUCT_LIST_REQ, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_ERROR, PRODUCT_DETAILS_REQ, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_ERROR, PRODUCT_SAVE_REQUEST, PRODUCT_SAVE_SUCCESS, PRODUCT_SAVE_FAIL, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL, PRODUCT_REVIEW_SAVE_REQUEST, PRODUCT_REVIEW_SAVE_SUCCESS, PRODUCT_REVIEW_SAVE_FAIL, PRODUCT_REVIEW_SAVE_RESET } from '../constants/productConstants';

const productListReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case PRODUCT_LIST_REQ:
            return { loading: true };
        case PRODUCT_LIST_SUCCESS:
            return { loading: false, products: action.payload };
        case PRODUCT_LIST_ERROR:
            return { loading: false, error: action.payload}
        
        default: 
            return state;
    }
}

const productDetailsReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQ:
            return { loading: true };
        case PRODUCT_DETAILS_SUCCESS:
            return { loading: false, product: action.payload };
        case PRODUCT_DETAILS_ERROR:
            return { loading: false, error: action.payload}
        
        default: 
            return state;
    }
}

const productSaveReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_SAVE_REQUEST:
            return { loading: true };
        case PRODUCT_SAVE_SUCCESS:
            return { loading: false, success: true, product: action.payload };
        case PRODUCT_SAVE_FAIL:
            return { loading: false, error: action.payload}
        
        default: 
            return state;
    }
}

const productDeleteReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_DELETE_REQUEST:
            return { loading: true };
        case PRODUCT_DELETE_SUCCESS:
            return { loading: false, success: true, product: action.payload };
        case PRODUCT_DELETE_FAIL:
            return { loading: false, error: action.payload}
        
        default: 
            return state;
    }
}

function productReviewSaveReducer(state = {}, action) {
    switch (action.type) {
      case PRODUCT_REVIEW_SAVE_REQUEST:
        return { loading: true };
      case PRODUCT_REVIEW_SAVE_SUCCESS:
        return { loading: false, review: action.payload, success: true };
      case PRODUCT_REVIEW_SAVE_FAIL:
        return { loading: false, errror: action.payload };
      case PRODUCT_REVIEW_SAVE_RESET:
        return {};
      default:
        return state;
    }
  }

export {productListReducer,productDetailsReducer, productSaveReducer, productDeleteReducer, productReviewSaveReducer};