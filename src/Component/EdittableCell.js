import {Form, InputNumber, Select} from "antd";
import React from "react";
import {findCustomer} from "../Request/requestCustomer";
import {findProduct} from "../Request/requestProduct";
import {formatter} from "./Product";


const EditableCell = ({
                          data,
                          editing,
                          dataIndex,
                          title,
                            form,
                          inputType,
                          record = {},
                          index,
                          children,
                          updateCustomerSelected,
                          ...restProps
                      }) => {

    const inputNode = setInputNode(inputType, dataIndex, data);

    async function handleOnchangeCustomer(key) {
        const customer = await findCustomer(key);
        updateCustomerSelected(customer)
    }
    function handleOnchangeQuantity(quantity){
        let price = form.getFieldValue('price');
        form.setFieldsValue({total: price * quantity })
    }


    async function handleOnchangeProduct(key) {
        const {quantity} = form.getFieldsValue();
        const product = await findProduct(key);
        form.setFieldsValue({price: product.price, total: product.price * quantity})
    }

    function setInputNode(inputType, dataIndex, data) {
        if (inputType === 'select' && dataIndex === 'customer') {
            return <Select onChange={handleOnchangeCustomer}>
                {data.dataCustomers.map(customer => {
                    return <Select.Option key={customer['key']}
                                          value={customer['key']}
                    >
                        {customer['name']}
                    </Select.Option>
                })}
            </Select>
        }
        if (inputType === 'select' && dataIndex === 'product') {
            return <Select onChange={handleOnchangeProduct}>
                {data.dataProducts.map(product => {
                    return <Select.Option key={product['key']}
                                          value={product['key']}
                    >
                        {product['name']}
                    </Select.Option>
                })}
            </Select>
        }
        if (inputType === 'number' && dataIndex === 'quantity') {
            return <InputNumber min={1}  onChange={handleOnchangeQuantity}/>
        }
        if (dataIndex === 'price' || dataIndex === 'total') {
            let price = form.getFieldValue('price');
            let quantity = form.getFieldValue('quantity');
            return (<div>
                        {dataIndex === 'price' ? formatter.format(price) : formatter.format(quantity * price)}
                    </div>)
        }

    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
export default EditableCell