import React, { useMemo } from 'react';
import './slider.css';
import Rating from '../ratings/Rating';
import { Carousel } from 'antd';

export default (props) => {
    const reviewSlides = useMemo( ()=>{ return props.reviews.map(review =>
            <div className="review-slide">
                <div style={{padding: '10px'}}>
                <div className="r-name">{review.name}</div>
                <div className="r-stars">
                    <Rating value={review.rating} />
                </div>
                <div className="r-date"> <em>{review.createdAt.substring(0, 10)}</em></div>
                <div style={{fontSize: '1.1em'}}>- {review.comment}</div>
                </div>
            </div>
    ) },[])
    return (
        <Carousel dotPosition='right' style={{maxWidth: '100%'}} autoplay>
          {reviewSlides}
        </Carousel>
    );
};