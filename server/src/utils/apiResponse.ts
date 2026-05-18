interface ApiResponseOptions<T>{
    success: boolean;
    message: string;
    data?:T
}

export const apiResponse = <T>({
    success,
    message,
    data
}: ApiResponseOptions<T>) => {
    return {
        success,
        message,
        data
    }
}