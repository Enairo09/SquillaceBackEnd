
export default function updatePriceQty(productList = []) {
    let finalPrice = 0
    let totalQty = 0
    for (var i = 0; i < productList.length; i++) {
        finalPrice = productList[i].price + finalPrice;
        totalQty = productList[i].quantity + totalQty;
    }
    return { price: finalPrice, quantity: totalQty };
};
