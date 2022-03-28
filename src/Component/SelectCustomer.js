import React from 'react';
import {Select} from "antd";
const {Option} = Select;

const SelectCustomer = (props) => {
    const {customers} = props;
    return (
        <Select>
            {customers.map(customer =>{
                return <Option key={customer['key']}
                               value={customer['name']}
                >
                    <b>Name:</b> {customer['name']}

                </Option>
            })}
        </Select>
    );
};

export default SelectCustomer;