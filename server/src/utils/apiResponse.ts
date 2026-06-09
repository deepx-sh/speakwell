interface ApiResponseOptions<T>{
    success: boolean;
    message: string;
    data?: T,
    pagination?:unknown
}

export const apiResponse = <T>({
    success,
    message,
    data,
    pagination
}: ApiResponseOptions<T>) => {
    return {
        success,
        message,
        data,
        pagination
    }
}