export const getProducts = async () =>{
    const response = await fetch('https://crudexample-766eb-default-rtdb.firebaseio.com/products.json');
    const responseData = await response.json();

    const loadedCustomer = [];

    for (const key in responseData) {
        loadedCustomer.push({
            key: key,
            name: responseData[key].name,
            trademark: responseData[key].trademark,
            description: responseData[key].description,
            price: responseData[key].price
        })
    }
    return loadedCustomer;
}
export const editProduct = async (key,record) =>{
    try {
        await fetch(`https://crudexample-766eb-default-rtdb.firebaseio.com/products/${key}.json`, {
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
export const addProduct = async (record) => {
    try {
        return await fetch('https://crudexample-766eb-default-rtdb.firebaseio.com/products.json', {
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
export const  deleteProduct = async (key) =>{
    await fetch(`https://crudexample-766eb-default-rtdb.firebaseio.com/products/${key}.json`,{
        method: 'DELETE'
    })
}
export const findProduct = async (key) =>{
    try {
        let product = {};
        const response = await fetch(`https://crudexample-766eb-default-rtdb.firebaseio.com/products/${key}.json`)
        product = await response.json();
        return {key,...product};
    } catch (e) {
        console.log(e)
    }
}