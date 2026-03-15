import { useMutation } from "@tanstack/react-query";
import { useAuthStore, type User } from "../store/auth-store";
import { loginApi, logOutAllDevicesApi, logOutApi, registerApi } from "../services/api/auth-ep";
import { tokenManager } from "../lib/token-manager";
import toast from "react-hot-toast";
import { queryClient } from "../providers/queryClient";
import { useNavigate } from "react-router-dom";





export const useLogin=()=>{
    const setUser=useAuthStore((state)=>state.setUser);
    return useMutation({
        mutationFn:loginApi,
        onSuccess:(res: { data: { accessToken: string; user: User } })=>{
            tokenManager.setToken(res.data.accessToken);
            // console.log(res);
            // console.log(res.data.user);
            // console.log(res.data.accessToken);
            setUser(res.data.user);
              toast.success("Login successful!");

        }
    })
}


export const useRegister=()=>{
  const setUser=useAuthStore((state)=>state.setUser);
    return useMutation({
      mutationFn: registerApi,
  
      onSuccess: (res:{data:{accessToken:string;user:User}}) => {
        tokenManager.setToken(res.data.accessToken);
        setUser(res.data.user);
        toast.success("Registration successful!");
      },
    });
}

export const useLogout=()=>{
  // const queryClient=useQueryClient();
  const navigate=useNavigate();
    const setUser=useAuthStore((state)=>state.setUser);
    return useMutation({
        mutationFn: logOutApi,
        onSuccess:()=>{
            tokenManager.clearToken();
            setUser(null);
            
            queryClient.clear();
              toast.success("Logout successful!");
              navigate("/")
        }
    })
}

export const useAllDevicesLogout=()=>{
  const navigate=useNavigate();
    const setUser=useAuthStore((state)=>state.setUser);
    return useMutation({
        mutationFn: logOutAllDevicesApi,
        onSuccess:()=>{
            tokenManager.clearToken();
            setUser(null);
              toast.success("Logged out from all devices successfully!");
            navigate("/")
        }
    })
}