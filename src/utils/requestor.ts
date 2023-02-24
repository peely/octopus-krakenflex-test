// Basically the same as frontend API - some differences, don't copy and paste
import axios, { Axios, AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from 'axios';

//@ts-ignore
let _ourAxiosInstance: Axios = null;
const getGetAxios = () => {
    if (!_ourAxiosInstance) {
        _ourAxiosInstance = axios.create({
            timeout: 10000,
        });
    }

    return _ourAxiosInstance;
}

export const makeRequest = async (requestConfig: AxiosRequestConfig, retryCount: number = 0): Promise<AxiosResponse<any, any>> => {
    const axiosToUse = getGetAxios();
    const axiosResponse = await axiosToUse.request(requestConfig)

    // Attempt calls with status 500 responses three times (So, retry twice)
    if(axiosResponse.status === 500 && retryCount < 2) {
        // Lets try that again - after a 300 ms wait
        await (new Promise((res) => {
             setTimeout(res, 300)
        }));

        return makeRequest(requestConfig, retryCount + 1);
    }

    // Return the whole response incase calling logic wants it
    return axiosResponse;
}

export const makePostRequest = (url: string, data: Object, headers? : RawAxiosRequestHeaders) => {
    return makeRequest({
        method: 'post',
        url,
        data,
        headers: headers? headers : {}
    })

}

export const makeGetRequest = (url: string, data: Object, headers? : RawAxiosRequestHeaders) => {
    return makeRequest({
        method: 'get',
        url,
        params: data,
        headers: headers? headers : {}
    })
}