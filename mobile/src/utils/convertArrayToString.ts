export default (array: Array<any>, joinString: string) => {
  try {
    const arrayLength = array.length
    let result = ''
    let actualIndex = 0

    if (arrayLength === 1) {
      result = array[0]
    } else {
      result = array.reduce((previousReturn, nextItem) => {
        if (actualIndex < arrayLength) {
          actualIndex++
          return previousReturn + joinString + nextItem
        }

        return previousReturn + nextItem
      })
    }

    return result
  } catch (err) {
    return 'error'
  }
}
