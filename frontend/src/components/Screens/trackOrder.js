import React from 'react';
import { Steps, Modal } from 'antd';
import { CheckCircleOutlined, DropboxOutlined, CarOutlined, SmileOutlined } from '@ant-design/icons';

const { Step } = Steps;

function tellStatus(cs) {
    switch (cs) {
        case 'placed':
            return 0;
        case 'packed':
            return 1;
        case 'dispatched':
            return 2;
        case 'delivered':
            return 3;
        default:
            return 0;
    }
}

const TrackOrder = (props) => {
    return (
        <Modal
            title="Track Your Current Order here"
            visible={props.visible}
            onOk={props.closeModal}
            onCancel={props.closeModal}>
            <Steps direction="vertical" current={tellStatus(props.status)}>
                <Step title="Placed" description="Your Order Has Been Placed!" icon={<CheckCircleOutlined />} />
                <Step title="Packed" description="Packing has Done!!" icon={<DropboxOutlined />} />
                <Step title="Out for Delivery" description="Your order has been dispatched, You will recieve it in a week." icon={<CarOutlined />} />
                <Step title="Delivered" description="Your order has been delivered. Thanks for Shopping. Enjoy!!" icon={<SmileOutlined />} />
            </Steps>
        </Modal>
    )
};

export default TrackOrder;