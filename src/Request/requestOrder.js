

export const getOrders = async () =>{
    const response = await fetch('https://crudexample-766eb-default-rtdb.firebaseio.com/orders.json');
    const responseData = await response.json();

    const loadedOrders = [];

    for (const key in responseData) {
        loadedOrders.push({
            key: key,
            customer: responseData[key].customer,
            product: responseData[key].product,
            quantity: responseData[key].quantity,
            price: responseData[key].price,
            total: responseData[key].total
        })
    }
    return loadedOrders;
}