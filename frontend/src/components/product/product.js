import React from 'react';
import { NavLink } from 'react-router-dom';
import Rating from '../ratings/Rating';
import ProductSlider from '../swiper/productSlider';

const Product = (props) => {
    return (
        <li>
            <div className="product">
                <NavLink to={'products/' + props._id}>
                    <ProductSlider images={props.image} />
                </NavLink>
                <div className="p-name"> <NavLink to={'products/' + props._id}>{props.name}</NavLink> </div>
                <div className="p-brand">{props.brand}</div>
                <div className="p-rating">
                    <Rating
                        value={props.rating}
                        text={props.reviews + ' reviews'}
                    />
                </div>
                <div className="p-price">{props.price} <i className="fa fa-inr"></i></div>
            </div>
        </li>
    )
}

export default Product