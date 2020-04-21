export default function (count = 0, action) {
    //console.log('action redux shop', action);
    // signup
    if (action.type === 'setCount') {
        //console.log('redux count', action.count);
        return action.count;
    } else {
        return count;
    }
}
