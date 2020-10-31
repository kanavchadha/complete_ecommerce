import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { detailsProduct, saveProductReview } from '../../actions/productActions';
import { addToCart } from '../../actions/cartActions';
import Rating from '../ratings/Rating';
import { PRODUCT_REVIEW_SAVE_RESET } from '../../constants/productConstants';
import ProductImage from '../swiper/imageGallery';
import Swiper from '../swiper/slider';
import { Rate } from 'antd';
import { message } from 'antd';
import Spinner from '../spinner/spinner';


const ProductScreen = (props) => {
  // console.log(props);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const productDetails = useSelector(state => state.productDetails);
  const { product, loading, error } = productDetails;
  const productReviewSave = useSelector(state => state.productReviewSave);
  const { success: productSaveSuccess } = productReviewSave;

  const dispatch = useDispatch();

  useEffect(() => {
    if (productSaveSuccess) {
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_REVIEW_SAVE_RESET });
    }
    dispatch(detailsProduct(props.match.params.id));
    return () => {
    }
  }, [productSaveSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveProductReview(props.match.params.id, {
        name: userInfo.name,
        rating: rating,
        comment: comment,
      })
    );
    message.success('Your review has added successfully');
  };

  const addToCartHandler = () => {
    dispatch(addToCart(props.match.params.id, qty));
    props.history.push("/cart");
    message.success('Item Added to Cart');
  }

  return (
    <React.Fragment>
      <div className="prodDetailsPage">
        {loading ? <Spinner /> : error ? <div>{error}</div> : (
          <React.Fragment>
            <div className="details">
              <div className="details-image">
                {product.image ? <ProductImage images={product.image} /> : ''}
              </div>

              <div className="details-info">
                <ul>
                  <li className="detail-name">
                    <h2>{product.name}</h2>
                  </li>
                  <li className="detail-brand">
                    <span>{product.brand}</span>
                  </li>
                  <li className="detail-ratings">
                    <Rating value={product.rating} />
                    <span>{product.rating?product.rating.toFixed(2):''} Stars  ({product.reviews} Reviews)</span>
                  </li>
                  <li className="detail-price">
                    <b> <i className="fa fa-inr"> {product.price} </i></b>
                  </li>
                  <li className="detail-description">
                    <p> {product.description} </p>
                  </li>
                </ul>
              </div>
              <div className="details-action">
                <ul>
                  <li>
                    <b>Price:</b>  <i className="fa fa-inr"></i>{product.price}
                  </li>
                  <li>
                    <b> Category:</b> {product.category}
                  </li>
                  <li>
                    <b>Qty:</b> <select value={qty} onChange={(e) => { setQty(e.target.value) }}>
                      {
                        [...Array(product.countInStock).keys()].map(q =>
                          <option key={q} value={q + 1}>{q + 1}</option>
                        )
                      }

                    </select>
                  </li>
                  <li className="button">
                    {product.countInStock > 0 ? <button className="primary" disabled={userInfo ? false : true} onClick={addToCartHandler}>Add To Cart</button> : <button className="primary" disabled>Out Of Stock</button>}
                  </li>
                </ul>
              </div>
            </div>

            <div className="content-margined">
              <h1>Reviews</h1>
              <ul className="review" id="reviews">
                {product.reviewsCont ? !product.reviewsCont.length && <div>No reviews yet!</div> : ''}
                {product.reviewsCont ? <Swiper reviews={product.reviewsCont} /> : ''}

                <li>
                  <h2>Write a customer review</h2>
                  {userInfo ? (
                    <form onSubmit={submitHandler}>
                      <div className="ratingForm">
                        <Rate defaultValue={1} onChange={(value) => setRating(value)} />
                        <label htmlFor="comment" style={{ display: 'block' }}>Comment</label>
                        <textarea
                          name="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>

                        <button type="submit" className="button secondary">
                          Submit
                        </button>
                      </div>
                    </form>
                  ) : (
                      <div style={{ fontSize: '20px' }}>
                        Please <Link to="/signin">Sign-in</Link> to write a review.
                      </div>
                    )}
                </li>

              </ul>
            </div>

          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}

export default ProductScreen;