export const getDiscount = (price, cuttedPrice) => {
    return (((cuttedPrice - price) / cuttedPrice) * 100).toFixed();
}

export const getDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(new Date().getDate() + 3)
    return deliveryDate.toDateString().substring(0, 11);
}

export const formatDate = (dt) => {
    return new Date(dt).toDateString().substring(0,16);
}

export const getRandomProducts = (prodsArray, n) => {
    return prodsArray.sort(() => 0.5 - Math.random()).slice(0, n)
}

export const getProductsCategory = (prodsArray, category) => {
    return prodsArray.filter((product) => product.category === category)
}