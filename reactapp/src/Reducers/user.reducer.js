export default function (user = '', action) {
    // signup
    if (action.type === 'setUser') {
        console.log(action.user)
        return action.user;
        // } else if (action.type === 'decoUser') {
        //     console.log('==============================deco user', action, user);
        //     return user;
    } else {
        return user;
    }
}