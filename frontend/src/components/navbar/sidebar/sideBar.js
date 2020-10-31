import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Sidebar = (props) => {

    function closeMenu() {
        document.querySelector(".sidebar").classList.remove("open")
    }

    return (
        <aside className="sidebar">
            <h1 className="sidebar-brand" style={{fontSize: '4rem', marginBottom: '2rem', paddingLeft: '16px', marginTop: '0px'}}>
                <NavLink to="/" exact> Amazon </NavLink>
            </h1>
            <button className="sidebar-close-button" onClick={closeMenu}><i className="fa fa-times"></i></button>
            <h2 className="category">Shopping Categories</h2>
            <ul className="sidebar-items">

                <li>
                    <Link to="/category/pants" exact> Pants</Link> 
                </li>

                <li>
                    <Link to="/category/shirt" exact>Shirts</Link>
                </li>

            </ul>
        </aside>
    )
}

export default Sidebar;
