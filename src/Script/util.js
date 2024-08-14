function findElement(array, elem) {
    for (let index = 0; index < array.length; index++) {
        if (array[index] === elem)
            return index;
    }
    return -1;
}
export function hasElement(array = [], find) {
    for (let index = 0; index < array.length; index++) {
        if (array[index] === find)
            return true;
    }
    return false;
}
export default findElement;
