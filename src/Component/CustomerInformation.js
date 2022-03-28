import React from 'react';
import {Card} from "antd";

const CustomerInformation = (props) => {
    const {record={}} = props;
    const {key='', name='', age='', address=''} = record;
    return (
        <Card title={'Customer Information'}>
            <p>ID: {key}</p>
            <p>Name: {name}</p>
            <p>Age: {age}</p>
            <p>Address: {address}</p>
        </Card>
    );
};

export default CustomerInformation;