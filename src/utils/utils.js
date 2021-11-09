function alertAndLogError(message, ...params) {
    console.error(message, ...params)
    alert(message)
}

export {
    alertAndLogError
}