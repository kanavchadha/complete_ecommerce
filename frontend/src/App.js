import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/navbar/navigation';
import Sidebar from './components/navbar/sidebar/sideBar';
import Footer from './components/footer/footer';

import HomeScreen from './components/Screens/homeScreen';
import ProductScreen from './components/Screens/productScreen';
import CartScreen from './components/Screens/cartScreen';
import SigninScreen from './components/Screens/signinScreen';
import RegisterScreen from './components/Screens/registerScreen';
import ProductsScreen from './components/Screens/addProductScreen';
import ProfileScreen from './components/Screens/profileScreen';
import ShippingScreen from './components/Screens/shippingScreen';
import PaymentScreen from './components/Screens/paymentScreen';
import PlaceOrderScreen from './components/Screens/placeOrderScreen';
import OrderScreen from './components/Screens/orderScreen';
import OrdersScreen from './components/Screens/ordersScreen';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from './actions/userActions.js';

function App() {
  const [isAuth, setAuth] = useState(false);
  const { userInfo } = useSelector(state => state.userSignin);

  useEffect(() => {
    if(userInfo && userInfo.token) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [userInfo])

  const dispatch = useDispatch()
  const logoutHandler = () => {
    dispatch(logout());
  }

  let activeRoutes;
  if (isAuth) {
    activeRoutes = (
      <Switch>
        <Route path="/category/:id" component={HomeScreen} />
        <Route path="/" exact component={HomeScreen} />
        <Route path="/products/:id" component={ProductScreen} />
        <Route path="/cart" component={CartScreen} /> {/* here ? means id is optional */}
        <Route path="/shipping" component={ShippingScreen} />
        <Route path="/payment" component={PaymentScreen} />
        <Route path="/order/:id" component={OrderScreen} />
        <Route path="/orders" component={OrdersScreen} />
        <Route path="/placeorder" component={PlaceOrderScreen} />
        <Route path="/adminproducts" component={ProductsScreen} />
        <Route path="/signin" component={SigninScreen} />
        <Route path="/myprofile" render={() => <ProfileScreen logout={logoutHandler} />} />
      </Switch>
    );
  } else{
    activeRoutes = (
      <Switch>
        <Route path="/category/:id" component={HomeScreen} />
        <Route path="/" exact component={HomeScreen} />
        <Route path="/products/:id" component={ProductScreen} />
        <Route path="/signin" component={SigninScreen} />
        <Route path="/register" component={RegisterScreen} />
        <Route path="/shipping" component={ShippingScreen} />
        <Redirect to="/" />
      </Switch>
    );
  } 

  return (
    <React.Fragment>
      <div className="grid-container">
        <Navbar logout={logoutHandler} />
        <Sidebar />
        <main className="main">
          <div className="content">
            {activeRoutes}
          </div>
        </main>
        <Footer />
      </div>
    </React.Fragment>
    );
}

export default App;
