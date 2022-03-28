import {Form, InputNumber, Select} from "antd";
import React from "react";
import {findCustomer} from "../Request/requestCustomer";
import {findProduct} from "../Request/requestProduct";

const EditableCell = ({
                          data,
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          updateCustomerSelected,
                          updateProductSelected,
                          ...restProps
                      }) => {

    const inputNode = setInputNode(inputType, dataIndex, data);

    async function handleOnchangeCustomer(key) {
        const customer = await findCustomer(key);
        updateCustomerSelected(customer)
    }
    async function handleOnchangeProduct(key){
        const product = await findProduct(key);
    }

    function setInputNode(inputType, dataIndex, data) {
        if (inputType === 'select' && dataIndex === 'customer') {
            return <Select onChange={handleOnchangeCustomer}>
                {data.dataCustomers.map(customer => {
                    return <Select.Option key={customer['key']}
                                          value={customer['key']}
                    >
                        <b>Name:</b> {customer['name']}
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
            return <InputNumber onChange={updateProductSelected}/>
        } else {
            return <InputNumber/>
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