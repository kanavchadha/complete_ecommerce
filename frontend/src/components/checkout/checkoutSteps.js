import React from 'react';
import { Steps } from 'antd';
import {UserOutlined,HomeOutlined,DollarCircleOutlined,FileDoneOutlined} from '@ant-design/icons';

const { Step } = Steps;

const CheckoutSteps = (props)=>(
    <Steps current={props.curr} style={{width: '65rem', margin: '0 auto', marginTop: '30px'}}>
      <Step title="Signin" description="Signin to your account." icon={<UserOutlined />} />
      <Step title="Shipping" description="Write Your Delivery Address." icon={<HomeOutlined />} />
      <Step title="Payment" description="Choose the Payment method." icon={<DollarCircleOutlined />}/>
      <Step title="Place Order" description="Finally Place your Order." icon={<FileDoneOutlined />}/>
    </Steps>
)

// const CheckoutSteps = (props)=>{
//   return <div className="checkout-steps">
//     <div className={props.step1 ? 'active' : ''} >Signin</div> <span className={props.step1 ? 'active' : ''}></span>
//     <div className={props.step2 ? 'active' : ''} >Shipping</div> <span className={props.step2 ? 'active' : ''}></span>
//     <div className={props.step3 ? 'active' : ''} >Payment</div> <span className={props.step3 ? 'active' : ''}></span>
//     <div className={props.step4 ? 'active' : ''} >Place Order</div><span className={props.step4 ? 'active' : ''}></span>
//   </div>
// }

export default CheckoutSteps;