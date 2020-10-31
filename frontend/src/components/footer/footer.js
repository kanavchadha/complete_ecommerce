import React from 'react';
import {Link} from 'react-router-dom';
import './footer.css';

const Footer = () => {
    return (
        <footer className="footer footer-distributed">
            <div className="footer-left">
                <h3> <span>Amazon</span>
                    <span><img src="https://static.showit.co/1200/9pF995IrQ-69tr5HpU0oag/76066/jj_logo_orig_1.png" alt="pic"/></span>
                </h3>
                <p className="footer-links">
                    <Link to="/">Home</Link>

                    <Link to="/">Policies</Link>

                    <Link to="/">Pricing</Link>

                    <Link to="/">About</Link>

                    <Link to="/">Faq</Link>
                </p>

                <p className="footer-company-name">Amazon © 2015</p>
                <div className="footer-icons">
                    <a href="#"><i className="fa fa-facebook"></i></a>
                    <a href="#"><i className="fa fa-twitter"></i></a>
                    <a href="#"><i className="fa fa-linkedin"></i></a>
                    <a href="#"><i className="fa fa-github"></i></a>
                </div>
            </div>
            <div className="footer-right">
                <p>Contact Us</p>
                <form action="#" method="post">
                    <input type="text" name="email" placeholder="Email" />
                    <textarea name="message" placeholder="Message"></textarea>
                    <button>Send</button>
                </form>
            </div>
        </footer>
    )
}

export default Footer;