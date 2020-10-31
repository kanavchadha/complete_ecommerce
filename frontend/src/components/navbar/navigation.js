import React, { useState, useEffect, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { productList } from '../../actions/productActions';
import { Menu, Dropdown, Badge } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Input, AutoComplete } from 'antd';

const Navbar = (props) => {    
    const { products, loading } = useSelector(state => state.productList);
    const { cartItems } = useSelector(state => state.cart);
    const { userInfo } = useSelector(state => state.userSignin);
    const dispatch = useDispatch();

    const [searchOptions, setSearchOptions] = useState([]);
    useEffect(()=>{
        let opt = [];
        if(!loading && products){
            opt = products.map(p => ({value: p.name}));
            console.log(opt);
            setSearchOptions([...opt]);
        }        
    },[])
    
    const menu = (
        <Menu>
            <Menu.Item>
                <NavLink to="/myprofile" exact> <b className="dropdown-item">My Profile</b></NavLink>
            </Menu.Item>
            <Menu.Item>
                <a onClick={props.logout}>
                    <b className="dropdown-item">Logout</b>
                </a>    
            </Menu.Item>
        </Menu>
    );
    // const [searchKeyword, setSearchKeyword] = useState('');
    
    function openMenu() {
        document.querySelector(".sidebar").classList.add("open");
    }

    const submitHandler = (value) => {
        if(value!=='') dispatch(productList('', value, '',''));
    };

    const showSuggestions = (value)=>{
        let opt=[],filterOpt=[];
        if(!loading && products){
            filterOpt = products.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));
            opt = filterOpt.map(fo => ({value: fo.name}));
            setSearchOptions([...opt]);
        }
    }

    return (
        <header className="header">
                <div className="brand">
                    <button className="hamburg" onClick={openMenu}>
                        <i className="fa fa-bars"></i>
                    </button>
                    <NavLink to="/" exact> Amazon </NavLink>
                </div>

                <div className="search-bar">
                    <form>
                        <AutoComplete
                            dropdownMatchSelectWidth={252}
                            options={searchOptions}
                            onSelect={submitHandler}
                            onSearch={showSuggestions}
                        >
                            <Input.Search size="large" placeholder="Search here" enterButton />
                        </AutoComplete>
                        {/* <button type="submit"><i className="fa fa-search"></i></button> */}
                    </form>
                </div>
            
            <div className="header-links">
                {
                    userInfo ? <Fragment>
                        <span style={{ marginRight: '10px' }}><Badge size="small" count={cartItems ? cartItems.length : 0}><NavLink to="/cart">Cart</NavLink></Badge></span>
                        <Dropdown overlay={menu} arrow >
                            <a className="ant-dropdown-link myprofile" onClick={e => e.preventDefault()}>
                             {userInfo.name.split(' ')[0]} <DownOutlined />
                            </a>
                        </Dropdown> 
                    </Fragment> :
                        <NavLink to="/signin">Signin</NavLink>
                }
            </div>
        </header>
    )
}

export default Navbar;