import axios from 'axios'

export const axiosInstance = axios.create({});

export const apiConnector = (method: string, url:string) => {
    return axiosInstance({
        method:`${method}`,
        url:`${url}`
    });
}
