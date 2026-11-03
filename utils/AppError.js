class AppError extends Error{
    constructor(message,statusCode){
        super(message)

        this.statusCode=statusCode
        this.status='Fail'
    }
}
export default AppError