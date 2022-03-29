import {findCustomer} from "./requestCustomer";
import {findProduct} from "./requestProduct";


export const getOrders = async () =>{
    const response = await fetch('https://crudexample-766eb-default-rtdb.firebaseio.com/orders.json');
    const responseData = await response.json();

    const loadedOrders = [];

    for (const key in responseData) {
        let customer = {};
        let product = {};
        const customerKey = responseData[key].customer;
        const productKey = responseData[key].product;
        await findProduct(productKey).then(result => product = result);
        await findCustomer(customerKey).then(result => customer = result);
        loadedOrders.push({
            key: key,
            customer: customer.name,
            product: product.name,
            quantity: responseData[key].quantity,
            price: responseData[key].price,
            total: responseData[key].total,
            productKey,
            customerObj : customer
        })
    }
    return loadedOrders;
}
export const editOrder = async (key,record) =>{
    try {
        await fetch(`https://crudexample-766eb-default-rtdb.firebaseio.com/orders/${key}.json`, {
            method: 'PUT',
            body: JSON.stringify(record),
            headers: {

                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        console.log(e)
    }
}
export const addOrder = async (record) => {
    try {
        return await fetch('https://crudexample-766eb-default-rtdb.firebaseio.com/orders.json', {
            method: 'POST',
            body: JSON.stringify(record),
            headers: {

                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        console.log(e)
    }
}
export const  deleteOrder = async (key) =>{
    await fetch(`https://crudexample-766eb-default-rtdb.firebaseio.com/orders/${key}.json`,{
        method: 'DELETE'
    })
}