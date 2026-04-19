import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTheaterApi, deleteTheaterApi, getTheaterApi } from "../services/api/theater-ep";

export const useGetTheaters=()=>{
    return useQuery({
        queryKey:["getTheaters"],
        queryFn:getTheaterApi
    })
}


export const useAddNewTheater=()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:addTheaterApi,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["getTheaters"]})
        }
    })
}

export const useDeleteTheater=()=>{
        const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn:(id:string)=>deleteTheaterApi(id),
            onSuccess:()=>{
                queryClient.invalidateQueries({queryKey:["getTheaters"]})
            }
        })
}