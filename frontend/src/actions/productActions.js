import { PRODUCT_LIST_REQ, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_ERROR, PRODUCT_DETAILS_REQ, PRODUCT_DETAILS_SUCCESS,PRODUCT_DETAILS_ERROR, PRODUCT_SAVE_REQUEST, PRODUCT_SAVE_SUCCESS, PRODUCT_SAVE_FAIL, PRODUCT_DELETE_FAIL, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_REVIEW_SAVE_REQUEST, PRODUCT_REVIEW_SAVE_SUCCESS, PRODUCT_REVIEW_SAVE_FAIL } from '../constants/productConstants';
import axios from 'axios';

const productList = ( category = '',searchKeyword = '',sortOrder = '', rateFilter='', priceFilter='') =>
    async (dispatch) => {
        try {
            dispatch({ type: PRODUCT_LIST_REQ })
            const { data } = await axios.get('/api/products?category='+category+'&searchKeyword='+searchKeyword +
            '&sortOrder=' + sortOrder+'&rateFilter='+rateFilter+'&priceFilter='+priceFilter );
            dispatch({
                type: PRODUCT_LIST_SUCCESS,
                payload: data
            });
        } catch (err) {
            dispatch({
                type: PRODUCT_LIST_ERROR,
                payload: err.message
            });
        }
    }

const detailsProduct = (prodId)=>
    async (dispatch)=>{
        try{
            dispatch({type: PRODUCT_DETAILS_REQ });
            const {data} = await axios.get('/api/products/'+prodId);
            // console.log(data.reviewsCont);
            dispatch({type: PRODUCT_DETAILS_SUCCESS, payload: data});
        }catch(err){
            dispatch({type: PRODUCT_DETAILS_ERROR, payload: err.message});
        }
    }

const saveProduct = (product)=>
    async (dispatch,getState)=>{
        try{
            dispatch({type: PRODUCT_SAVE_REQUEST, payload: product})
            const {userSignin: {userInfo}} = getState();
            if(product._id){
                const {data} = await axios.put('/api/products/'+product._id,
                    product,{
                        headers: {
                            'Authorization': 'Bearer ' + userInfo.token
                        }
                    });
                dispatch({type: PRODUCT_SAVE_SUCCESS, payload: data});
            } else{
                const {data} = await axios.post('/api/products',
                    product,{
                        headers: {
                            'Authorization': 'Bearer ' + userInfo.token
                        }
                    });
                dispatch({type: PRODUCT_SAVE_SUCCESS, payload: data});
            }
        } catch(err){
            dispatch({type: PRODUCT_SAVE_FAIL, payload: err.message});
        }
    }

const deleteProdcut = (prodId) => async (dispatch,getState)=>{
    try{
        dispatch({type: PRODUCT_DELETE_REQUEST});
        const {userSignin: {userInfo}} = getState();

        const {data} = await axios.delete('/api/products/'+prodId,{
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });
        dispatch({type: PRODUCT_DELETE_SUCCESS, payload: data});
    } catch(err){
        dispatch({type: PRODUCT_DELETE_FAIL, payload: err.message});
    }
}

const saveProductReview = (productId, review) => async (dispatch, getState) => {
    try {
      const { userSignin: { userInfo: { token }} } = getState();
      dispatch({ type: PRODUCT_REVIEW_SAVE_REQUEST, payload: review });
      const { data } = await axios.post(
        `/api/products/${productId}/reviews`, review,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      dispatch({ type: PRODUCT_REVIEW_SAVE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_REVIEW_SAVE_FAIL, payload: error.message });
    }
  };

export { productList, detailsProduct, saveProduct, deleteProdcut, saveProductReview};