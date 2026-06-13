import axios,{type AxiosError,type InternalAxiosRequestConfig} from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    withCredentials: true,
    headers: {
        "Content-Type":"application/json"
    }
})

const refreshApi = axios.create({
     baseURL: import.meta.env.VITE_API_URL + "/api",
    withCredentials: true,
    headers: {
        "Content-Type":"application/json"
    }
})

type RetryConfig = InternalAxiosRequestConfig & {
    _retry?:boolean
}
let isRefreshing = false;
let failedQueue: {
    resolve: () => void;
    reject: (reason?: unknown) => void
}[] = [];

const processQueue = (error: unknown ) => {
    failedQueue.forEach(({resolve,reject}) => {
        if (error) {
            reject(error)
        } else {
            resolve()
        }
    })

    failedQueue=[]
}

api.interceptors.response.use(
    (response) => response,
    async (error:AxiosError) => {
        const originalRequest = error.config as RetryConfig | undefined;
     
        if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
            return Promise.reject(error)
        }
            if (isRefreshing) {
                return new Promise<void>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest)
                    })  
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await refreshApi.post("/auth/refresh-token");
                processQueue(null);
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing=false
            }
        }
    
)