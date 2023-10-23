export const randomSort = (array, item) => {
    array.sort(() => Math.random() - 0.5)
    array.forEach(letter => {
        item += letter
    })
    return item
}