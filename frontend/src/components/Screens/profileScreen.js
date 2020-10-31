import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { update } from '../../actions/userActions';
import { listMyOrders, downloadInvoice} from '../../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../spinner/spinner';
import {Alert,message} from 'antd';


function ProfileScreen(props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  const userUpdate = useSelector(state => state.userUpdate);
  const { loading, success, error } = userUpdate;

  const myOrderList = useSelector(state => state.myOrderList);
  const { loading: loadingOrders, orders, error: errorOrders } = myOrderList;
  
  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email);
      setName(userInfo.name);
      setPassword(userInfo.password);
    }
    dispatch(listMyOrders());
    return () => {
    };
  }, [userInfo])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(update({ userId: userInfo._id, email, name, password }))
    message.success("Your Profile has updated Successfully!");
  }

  const invoiceDownload = (orderId)=>{
    dispatch(downloadInvoice(orderId));
  }

  return <div className="profile">
    <div className="profile-info">
      <div className="form">
        <form onSubmit={submitHandler} >
          <ul className="form-container">
            <li>
              <h2>User Profile</h2>
            </li>
            <li>
              {loading && <Spinner /> }
              {error && <div><Alert message={error} type="error" showIcon closable /></div>}
              {success && <div>Profile Saved Successfully.</div>}
            </li>
            <li>
              <label htmlFor="name">
                Name
          </label>
              <input value={name} type="name" name="name" id="name" onChange={(e) => setName(e.target.value)}>
              </input>
            </li>
            <li>
              <label htmlFor="email">
                Email
          </label>
              <input value={email} type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)}>
              </input>
            </li>

            <li>
              <button type="submit" className="button primary">Update</button>
            </li>
            <li>
              <button type="button" onClick={props.logout} className="button secondary full-width">Logout</button>
            </li>

          </ul>
        </form>
      </div>
      <div style={{textAlign: 'center'}}>
        { userInfo ? userInfo.isAdmin === true ? <Link to="/adminProducts"> Admin Dashboard </Link> : '':'' }
      </div>
    </div>
    <div className="profile-orders content-margined">
      {
        loadingOrders ? <Spinner /> :
          errorOrders ? <Alert message={errorOrders} type="error" showIcon /> :
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                { orders.length === 0 ? 'No Orders Yet!': 
                  orders.map(order => <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt}</td>
                    <td>{order.totalPrice?order.totalPrice.toFixed(2):''}</td>
                    <td>{order.isPaid?'true':'false'}</td>
                    <td>
                      { order.status !== 'delivered' ? 
                        <Link to={"/order/" + order._id}>DETAILS</Link>
                        : <button className="invoice" onClick={()=>{invoiceDownload(order._id)}}>INVOICE</button>
                      }
                    </td>
                  </tr>)
                }
              </tbody>
            </table>
      }
    </div>
  </div>
}

export default ProfileScreen;