import api from "./axios";

export const login =(payload)=>{
    return api.post('/auth/login',payload)

};
export const signup = (data) => {
  return api.post("/auth/signup", data);
};
