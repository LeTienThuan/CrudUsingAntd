import {findCustomer} from "./requestCustomer";

export const getOrders = async () =>{
    const response = await fetch('https://crudexample-766eb-default-rtdb.firebaseio.com/orders.json');
    const responseData = await response.json();

    const loadedOrders = [];

    for (const key in responseData) {
        const customerKey=  responseData[key].customer;
        const customer = await findCustomer(customerKey)
        loadedOrders.push({
            key: key,
            customer: customer['name'],
            product: responseData[key].product,
            quantity: responseData[key].quantity,
            price: responseData[key].price,
            total: responseData[key].total
        })
    }
    return loadedOrders;
}