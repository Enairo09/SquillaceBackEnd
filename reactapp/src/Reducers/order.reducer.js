import checkIfExist from "../Functions/checkIfExist";

export default function (order = '', action) {
    //console.log('action redux shop', action);
    // signup
    if (action.type === 'setOrder') {
        if (checkIfExist(action.order)) {
            return action.order;
        } else {
            return order
        }

    } else {
        return order;
    }
}
