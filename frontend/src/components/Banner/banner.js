import React from 'react';
import SwiperCore, { Navigation, EffectCoverflow,Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/effect-flip/effect-flip.scss';
import './banner.css';

SwiperCore.use([Navigation, Pagination, EffectCoverflow, Autoplay]);

const Banner = () => {
        return (
        <div className="banner">
        <Swiper effect="coverflow"
            spaceBetween={5}
            slidesPerView={1}
            navigation
            loop
            autoplay
            pagination={{ clickable: true }}
        >
            <SwiperSlide> <img alt="banner" className="banner" src="https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/130465537/original/9a86b0ce50637918bba6c90487c11564a5939382/do-minimal-gradient-fashion-banner.jpg" /></SwiperSlide>
            <SwiperSlide> <img alt="banner" className="banner" src="https://i.pinimg.com/originals/db/48/aa/db48aaae1418643d2288ccf4ce6da043.jpg" /></SwiperSlide>
            <SwiperSlide> <img alt="banner" className="banner" src="https://cdn2.f-cdn.com/contestentries/50629/2972773/52ac4a6d03f91_thumb900.jpg" /></SwiperSlide>
            <SwiperSlide> <img alt="banner" className="banner" src="https://justdealindia.com/upload/1537699228cat3.jpg" /></SwiperSlide>
            <SwiperSlide> <img alt="banner" className="banner" src="https://i.pinimg.com/originals/dd/10/d6/dd10d6fc25ac682d4567e62218d46343.jpg" /></SwiperSlide>            
        </Swiper>
        </div>    
    )
}

export default Banner;