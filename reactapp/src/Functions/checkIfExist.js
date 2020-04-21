
export default function checkIfExist(name) {
    if (name === 'undefined' || name === null || name === undefined || name === '' || name === false || name === []) {
        return false;
    } else {
        return true;
    }
};