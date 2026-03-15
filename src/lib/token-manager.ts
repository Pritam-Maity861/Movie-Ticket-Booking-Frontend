let accessToken: string | null = null;

export const tokenManager={
    setToken(token:string|null){
        accessToken=token;
    },
    getToken(){
        return accessToken;
    },
    clearToken(){
        accessToken=null;
    }
}
