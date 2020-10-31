import React, { useState, useEffect } from 'react';
import Product from '../product/product';
import Banner from '../Banner/banner';
import { useSelector, useDispatch } from 'react-redux';
import { productList } from '../../actions/productActions';
import Spinner from '../spinner/spinner';
import { Drawer, Button, Alert, Divider, Slider, Result } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';

const HomeScreen = (props) => {

    const category = props.match.params.id ? props.match.params.id : '';
    const { products, loading, error } = useSelector(state => state.productList);
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const [sortOrder, setSortOrder] = useState('');
    const [rateValue, setRateValue] = useState(1);
    const [priceFilter, setPriceFilter] = useState([0,5000]);

    useEffect(() => {
        dispatch(productList(category));
    }, [category]);
    useEffect(() => {
        dispatch(productList(category, '', sortOrder, rateValue, priceFilter));
    }, [sortOrder]);
    useEffect(() => {
        dispatch(productList(category, '', sortOrder, rateValue, priceFilter));
    }, [rateValue]);
    useEffect(() => {
        dispatch(productList(category, '', sortOrder, rateValue, priceFilter));
    }, [priceFilter]);

    const sortHandler = (order) => {
        setSortOrder(order);
    }
    const filterHandler = (value) => {
        setRateValue(value);
    }
    function onAfterChange(value) {
        setPriceFilter(value)
    }

    return (
        <div className="homePage">
            {category && <h1>{category}</h1>}
            <ul className="filter">
                <li>
                    <Button type="primary" shape="round" onClick={() => setVisible(true)}>
                        <i className="fa fa-sort-amount-desc" aria-hidden="true"></i> Filter
                    </Button>
                    <Drawer
                        title="Products Filters"
                        placement="right"
                        closable
                        onClose={() => setVisible(false)}
                        visible={visible}
                        getContainer={false}
                        // width='300'
                        style={{ position: 'absolute', height: '340px', zIndex: '1000' }}
                    >
                        <div className="filters">
                            <Divider orientation="left" style={{ color: 'white' }}>Sorting</Divider>
                            <div><input type="radio" name="sorting" value="" id="f1" onChange={(e) => sortHandler(e.target.value)} /><label>Latest</label></div>
                            <div><input type="radio" name="sorting" value="lowest" id="f2" onChange={(e) => sortHandler(e.target.value)} /><label>Price Lowest {'-->'} Highest</label></div>
                            <div><input type="radio" name="sorting" value="highest" id="f3" onChange={(e) => sortHandler(e.target.value)} /><label>Price Highest {'-->'} Lowest</label></div>
                            <div><input type="radio" name="sorting" value="highRated" id="f4" onChange={(e) => sortHandler(e.target.value)} /><label>Highest Rated</label></div>
                            <Divider orientation="left" style={{ color: 'white' }}>Rating Filters</Divider>
                            <div className="icon-wrapper">
                                <FrownOutlined />
                                <Slider onChange={(value) => { filterHandler(value) }} min={1} max={5} value={rateValue} marks={{ 1: '>=1', 2: '>=2', 3: '>=3', 4: '>=4', 5: '>=5' }} />
                                <SmileOutlined />
                            </div>
                            <Divider orientation="left" style={{ color: 'white' }}>Price Filters</Divider>
                            <Slider range step={200} max={5000} defaultValue={[0, 5000]}
                                onAfterChange={onAfterChange}
                            />
                        </div>
                    </Drawer>
                </li>
            </ul>
            <Banner />
            {loading ? <Spinner /> : error ? <div><Alert message={error} type="error" showIcon /></div> : (
                <ul className="products">
                    {
                        products.length === 0 ?
                            <Result title="Sorry! No Product Found." /> :
                        products.map(product =>
                            <Product key={product._id}
                                _id={product._id}
                                name={product.name}
                                brand={product.brand}
                                image={product.image}
                                price={product.price}
                                rating={product.rating}
                                reviews={product.reviews}
                            />
                            )
                    }
                </ul>
            )}
        </div>
    )
}

export default HomeScreen;