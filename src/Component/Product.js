import React, {useEffect, useState} from 'react';
import {Table, Input, Popconfirm, Form, Typography, Space, message, Button, InputNumber} from 'antd';
import {addProduct, deleteProduct, editProduct, getProducts} from "../Request/requestProduct";

export const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
})

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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

const Product = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch('https://crudexample-766eb-default-rtdb.firebaseio.com/products.json');
            const responseData = await response.json();
            const loadedProduct = [];
            for (const key in responseData) {
                loadedProduct.push({
                    key: key,
                    name: responseData[key].name,
                    trademark: responseData[key].trademark,
                    description: responseData[key].description,
                    price: responseData[key].price
                })
            }
            setData(loadedProduct)
        }
        fetchProduct()
    }, [])

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = async (record) => {
        const {key = '', name = '', trademark = '', description = '', price = 0} = record;
        if (name === '' && trademark === '' && description === '' && price === 0) {
            await deleteProduct(key);
        }
        await getProducts().then(products => setData(products))
        setEditingKey('');

    };
    const removeProduct = async (key) => {
        await deleteProduct(key);
        await getProducts().then(products => setData(products));
        message.success('Delete Successfully')
    }
    const saveTemperatureProduct = async () => {
        let key = '';
        const record = {name: '', trademark: '', description: '', price: 0};
        const response = (await addProduct(record)).json()
        await response.then(result => key = result['name'])
        return key;
    }
    const handAddProduct = async () => {
        const key = await saveTemperatureProduct();
        const newData = [...data];
        const record = {name: '', trademark: '', description: '', price: 0};
        newData.push({key, ...record});
        setData(newData);
        setEditingKey(key);
    }

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {...item, ...row});
                await editProduct(key, row);
                message.success('Edit Successfully')
                setData(newData);
                setEditingKey('');
                form.resetFields();
            } else {

            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '20%',
            editable: true,
        },
        {
            title: 'Trademark',
            dataIndex: 'trademark',
            width: '10%',
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '40%',
            editable: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: '10%',
            editable: true,
            render: price =>{
                return formatter.format(price);
            }
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <Typography.Link
                onClick={() => save(record.key)}
                style={{
                    marginRight: 8,
                }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record)}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (<Space size='large'>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title='Sure to delete' onConfirm={() => removeProduct(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </Space>


                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'price' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (<>
            <Button type='primary'
                    style={{marginBottom: '10px'}}
                    onClick={handAddProduct}

            >Add New Product</Button>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>
        </>

    );
};
export default Product