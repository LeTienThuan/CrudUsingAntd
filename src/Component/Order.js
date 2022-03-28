import React, {useEffect, useState} from 'react';
import {Table, Popconfirm, Form, Typography, Button} from 'antd';
import {getCustomers} from "../Request/requestCustomer";
import {getProducts} from "../Request/requestProduct";
import {getOrders} from "../Request/requestOrder";
import CustomerInformation from "./CustomerInformation";
import EditableCell from "./EdittableCell";

const Order = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState({
        customers: [],
        products: [],
        orders: []
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
            ...record
        });
        setEditingKey(record.key);
    };
    const handleAddOrder = () =>{
     /*   const key = Date.now().toString();
        const newData = [...data.orders];
        const newOrder = {key,customer: '', product:'', quantity:0, price:0, total:0};
        newData.push(newOrder)
        setEditingKey(key);
        setData(prev => {
            return {...prev, orders: newData}
        })*/
    }

    const cancel = () => {
        setEditingKey('');
    };
    const setInputType = (dataIndex) => {
        if (dataIndex === 'customer' || dataIndex === 'product') {
            return 'select'
        } else {
            return 'number'
        }
    }
    const save = (key) =>{

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
            editable: false,

        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '15%',
            editable: false,

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
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const updateCustomerSelected = (values) =>{
        setCustomerSelected(values)
    }
    const updateProductSelected = async (product) =>{
        console.log(form.getFieldsValue())

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
                inputType: setInputType(col.dataIndex),
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                updateCustomerSelected,
                updateProductSelected
            }),
        };
    });
    return (
        <>
            <div style={{display:"flex", justifyContent:'space-between'}}>
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
