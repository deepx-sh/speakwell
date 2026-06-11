import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    withCredentials: true,
    headers: {
        "Content-Type":"application/json"
    }
})

let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void
}[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error)
        } else {
            promise.resolve()
        }
    })

    failedQueue=[]
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err)=>Promise.reject(err))
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post("/auth/refresh-token");
                processQueue(null);
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError);
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing=false
            }
        }

        return Promise.reject(error)
    }
)