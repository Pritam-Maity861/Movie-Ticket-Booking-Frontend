import { tokenManager } from "../lib/token-manager";
import { refreshTokenApi } from "./api/auth-ep";
import { httpService } from "./http-service";

type subscriber = (token: string) => void;

/**
 * @description this array will hold the subscribers which will be called when the access token is refreshed and it will receive the new access token as an argument
 */
let subscribers: subscriber[] = [];

/**
 * @description this function will be called when the access token is expired and it will add the callback to the subscribers array which will be called when the access token is refreshed and it will receive the new access token as an argument
 * @param cb the callback function that will be called when the access token is refreshed and it will receive the new access token as an argument
 */
export const subscribeTokenRefresh = (cb: subscriber) => {
    subscribers.push(cb);
}

/**
 * @description this function will be called when the access token is refreshed and it will call all the subscribers with the new token and then clear the subscribers array
 */
export const onTokenRefreshed = (token: string) => {
    subscribers.forEach((cb) => cb(token));
    subscribers = [];
}


let isRefreshing = false;
httpService.interceptors.response.use(
    (response)=>response,

    async(error)=>{
        const originalRequest=error.config;
        if(error.response.status===401 && !originalRequest._retry){
            if(isRefreshing){
                return new Promise((resolve)=>{
                    subscribeTokenRefresh((token)=>{
                        originalRequest.headers["Authorization"]=`Bearer ${token}`;
                        resolve(httpService(originalRequest));
                    })
                })
            }
            originalRequest._retry=true;
            isRefreshing=true;
            try{
                const data=await refreshTokenApi();
                const newToken=data.accessToken;
                tokenManager.setToken(newToken);
                onTokenRefreshed(newToken);
                originalRequest.headers["Authorization"]=`Bearer ${newToken}`;
                return httpService(originalRequest);
            }catch(err){
                tokenManager.clearToken();
                window.location.href="/login";
                return Promise.reject(err);
            }finally{
                isRefreshing=false;
            }
        }
        return Promise.reject(error);
    }
)