import axios from "axios";
import { tokenManager } from "../lib/token-manager";


export const httpService = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

httpService.interceptors.request.use((config)=>{
    const token=tokenManager.getToken();
    if(token){
        config.headers["Authorization"]=`Bearer ${token}`;
    }
    return config;
})