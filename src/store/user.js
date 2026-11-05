import { createSlice } from "@reduxjs/toolkit";

 const userSlice = createSlice({
    name:'user',
    initalState:{
        user:""
    },
    reducers:{
        userLogin(state,action){
            state.user = action.payload;
        }
    }
 })

 export default userSlice;