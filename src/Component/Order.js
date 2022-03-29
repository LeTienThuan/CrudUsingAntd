import React, {useEffect, useState} from 'react';
import {Button, Form, Popconfirm, Space, Table, Typography} from 'antd';
import {getCustomers} from "../Request/requestCustomer";
import {getProducts} from "../Request/requestProduct";
import {addOrder, deleteOrder, editOrder, getOrders} from "../Request/requestOrder";
import CustomerInformation from "./CustomerInformation";
import EditableCell from "./EdittableCell";
import {formatter} from "./Product";

const Order = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState({
        dataCustomers: [],
        dataProducts: [],
        dataOrders: []
    });
    const [editingKey, setEditingKey] = useState('');
    const [customerSelected, setCustomerSelected] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const dataCustomers = await getCustomers();
            const dataProducts = await getProducts();
            const dataOrders = await getOrders();

            setData({
                dataCustomers,
                dataProducts,
                dataOrders
            })
        }
        fetchData();
    }, [])

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record, customer: record.customerObj.key, product: record.productKey
        });
        setEditingKey(record.key);
        setCustomerSelected(record.customerObj)
    };
    const handleAddOrder = () => {
        const key = Date.now().toString();
        const dataOrders = [...data.dataOrders];
        dataOrders.push({key})
        setData({...data, dataOrders});
        form.setFieldsValue({customer: '', product: '', quantity: 1, price: 0, total: 0});
        setEditingKey(key);
    }
    const removeCustomer = async (key) => {
        await deleteOrder(key);
        await getOrders().then(dataOrders => setData(prevState => {
            return {...prevState, dataOrders}
        }))
    }
    const cancel = () => {
        const index = data.dataOrders.findIndex((item) => editingKey === item.key);
        if (index > -1 && data.dataOrders[index].customer === undefined) {
            const newData = data.dataOrders.filter((order) => {
                return order.key !== data.dataOrders[index].key
            })
            setData({...data, dataOrders: newData})
        }
        setCustomerSelected({})
        setEditingKey('');
    };
    const setInputType = (dataIndex) => {
        if (dataIndex === 'customer' || dataIndex === 'product') {
            return 'select'
        } else {
            return 'number'
        }
    }
    const save = async (key) => {
        const row = await form.validateFields();
        const index = data.dataOrders.findIndex((item) => key === item.key);
        if (index > -1) {
            if (data.dataOrders[index].customer === undefined) {
                await addOrder(row);
                await getOrders().then(dataOrders => setData(prevState => {
                    return {...prevState, dataOrders}
                }))
                setEditingKey('');
                setCustomerSelected({})
                form.resetFields();
            } else {
                await editOrder(key, row);
                await getOrders().then(dataOrders => setData(prevState => {
                    return {...prevState, dataOrders}
                }))
                setEditingKey('');
                setCustomerSelected({})
                form.resetFields();
            }
        }
    }

    const columns = [
        {
            title: 'Customer',
            dataIndex: 'customer',
            width: '20%',
            editable: true,
        },
        {
            title: 'Product',
            dataIndex: 'product',
            width: '20%',
            editable: true,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            width: '15%',
            editable: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: '15%',
            editable: true,
            render: (record) => {
                return formatter.format(record)
            }
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '15%',
            editable: true,
            render: (record) => {
                return formatter.format(record)
            }
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
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
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (<Space>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title='Sure to delete' onConfirm={() => removeCustomer(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </Space>

                );
            },
        },
    ];

    const updateCustomerSelected = (values) => {
        setCustomerSelected(values)
    }

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                data,
                record,
                form,
                inputType: setInputType(col.dataIndex),
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                updateCustomerSelected
            }),
        };
    });
    return (
        <>
            <div style={{display: "flex", justifyContent: 'space-between'}}>
                <Button type='primary' size={"large"} onClick={handleAddOrder}>
                    Add New Order
                </Button>
                <CustomerInformation record={customerSelected}/>
            </div>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    onChange={() => {
                        console.log('called')
                    }}
                    bordered
                    dataSource={data.dataOrders}
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
export default Order;
