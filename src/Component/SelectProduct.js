import React from 'react';
import {Select} from "antd";
const {Option} = Select;

const SelectProduct = (props) => {
    const {products} = props;
    return (
        <Select>
            {products.map(product =>{
                return <Option key={product['key']}
                               value={ product['key']}
                >
                    {product['name']}
                </Option>
            })}
        </Select>
    );
};

export default SelectProduct;