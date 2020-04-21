export default function (basket = [], action) {
    //console.log('action redux shop', action);
    // signup
    if (action.type === 'setBasket') {
        basket.push(action.basket);
        return basket;
    } else if (action.type === 'updateBasket') {
        console.log('updateBasket =========', action.basket)
        return action.basket;
    } else if (action.type === 'deleteBasket') {
        //console.log('retour du front au reducer', action);
        return action.basket;
    } else {
        return basket;
    }
}
