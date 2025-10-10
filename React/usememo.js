function usemymemo(factors, dept) {
    let perdeps = []
    let prevValue

    return function () {
        const haschanges = !perdeps || dept.some((dept, i) => dept !== perdeps[i])

        if (haschanges) {
            prevValue = factors()
            perdeps = dept
        }
        return prevValue
    }
}