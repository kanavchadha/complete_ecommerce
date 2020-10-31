import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders, deleteOrder, orderStatus } from '../../actions/orderActions';
import Spinner from '../spinner/spinner';
import { Select, Alert, Spin, Popconfirm, message } from 'antd';

const { Option } = Select;

function OrdersScreen(props) {

  const orderList = useSelector(state => state.orderList);
  const { loading, orders, error } = orderList;

  const orderDelete = useSelector(state => state.orderDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = orderDelete;
  
  const { loading: loadingStatus, currStatus, error: errorStatus } = useSelector(state => state.orderStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrders());
    return () => {
      //
    };
  }, [successDelete,currStatus]);

  const deleteHandler = (order) => {
    dispatch(deleteOrder(order._id));
  }
  const handleChange = (value,orderId)=>{
    dispatch(orderStatus(orderId,value));
  }
  function cancel(e) {
    message.error('Click on No');
  }

  return loading ? <Spinner /> :
    error ? <Alert message={error} type="error" showIcon /> :
      <div className="content content-margined">

        <div className="order-header">
          <h1>Orders</h1>
        </div>
        <div className="order-list">

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>USER</th>
                <th>PAID</th>
                <th>PAID_AT</th>
                <th>STATUS</th>
                <th>DELIVERD_AT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (<tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt && order.createdAt.slice(0, 10)}</td>
                <td>{order.totalPrice && order.totalPrice.toFixed(2)}</td>
                <td>{order.user.name}</td>
                <td>{order.isPaid.toString()}</td>
                <td>{order.paidAt && order.paidAt.slice(0, 10)}</td>
                <td> { loadingStatus ? <Spin />: errorStatus ?  <Alert message={errorStatus} type="error" closable />:
                  <Select defaultValue={order.status} onChange={(value)=>{handleChange(value,order._id)}} style={{borderRadius: '10px'}}>
                    <Option value="pending">Pending</Option>
                    <Option value="placed">Placed</Option>
                    <Option value="packed">Packed</Option>
                    <Option value="dispatched">Dispatched</Option>
                    <Option value="delivered">Delivered</Option>
                  </Select> }
                </td>
                <td>{order.deliveredAt ? order.deliveredAt.slice(0, 10) : order.isDelivered.toString()}</td>
                <td>
                  <Link to={"/order/" + order._id} className="button edit" >Details</Link>
                  <Popconfirm
                      title="Are you sure delete this Product?"
                      onConfirm={() => deleteHandler(order)}
                      onCancel={cancel}
                      okText="Delete"
                      cancelText="Cancel">
                      <button type="button" className="button delete">Delete</button>
                  </Popconfirm>
                </td>
              </tr>))}
            </tbody>
          </table>

        </div>
      </div>
}
export default OrdersScreen;