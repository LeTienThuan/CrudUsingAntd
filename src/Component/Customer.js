import React, {useEffect, useState} from 'react';
import {Table, Input, InputNumber, Popconfirm, Form, Typography, Space, message, Button} from 'antd';
import {addCustomer, deleteCustomer, editCustomer, getCustomers} from "../Request/requestCustomer";

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
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
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

const Customer = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');

    useEffect(() => {
        const fetchCustomer = async () => {
            const response = await fetch('https://crudexample-766eb-default-rtdb.firebaseio.com/customers.json');
            const responseData = await response.json();
            const loadedCustomer = [];
            for (const key in responseData) {
                loadedCustomer.push({
                    key: key,
                    name: responseData[key].name,
                    age: responseData[key].age,
                    address: responseData[key].address
                })
            }
            setData(loadedCustomer)
        }
        fetchCustomer()
    }, [])

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = async (record) => {
        const {key, name, age, address} = record;
        if (name === '' && age === '' && address === '') {
            await deleteCustomer(key);
        }
        await getCustomers().then(customers => setData(customers))
        setEditingKey('');

    };
    const removeCustomer = async (key) => {
        await deleteCustomer(key);
        await getCustomers().then(customers => setData(customers));
        message.success('Delete Successfully')
    }
    const saveTemperatureCustomer = async () => {
        let key = '';
        const record = {name: '', age: '', address: ''}
        const response = (await addCustomer(record)).json()
        await response.then(result => key = result['name'])
        return key;
    }
    const handAddCustomer = async () => {
 //       const key = await saveTemperatureCustomer();
        const key =Date.now().toString();
        const newData = [...data];
        const record = {name: '', age: '', address: ''}
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
                await editCustomer(key, row);
                message.success('Edit Successfully')
                setData(newData);
                setEditingKey('');
                form.resetFields();
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            width: '15%',
            editable: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            width: '40%',
            editable: true,
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
            <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record)}>
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
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (<>
            <Button type='primary'
                    style={{marginBottom: '10px'}}
                    onClick={handAddCustomer}

            >Add New Customer</Button>

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
export default Customer