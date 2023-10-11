import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

interface AccountState{
    user: User | null,
    
}

const initialState : AccountState = {
    user : null,
}

export const signInUser = createAsyncThunk<User,FieldValues>(  //User we recive FieldValues we send
    'account/signInUser',
    async (data, thunkAPI)=>{
        try{
            const userDto = await agent.Account.login(data);
            const {basket, ...user} = userDto; //all properties from userDto except basket create new type called user
            if(basket) thunkAPI.dispatch(setBasket(basket));
            //storing data in local storage
            localStorage.setItem("user",JSON.stringify(user));
            return user;
        }catch(error: any){
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const getCurrentUser = createAsyncThunk<User>(
    'account/getCurrentUser',
    async (_,thunnkAPI)=>{
        thunnkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try{
            const userDto = await agent.Account.currentUser();
            const {basket, ...user} = userDto;
            if(basket) thunnkAPI.dispatch(setBasket(basket));
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        }catch(error:any){
            return thunnkAPI.rejectWithValue({error:error.data})
        }
    },
    {
        condition:()=>{ //before using getCurrentUser method condition function is checked.
            if(!localStorage.getItem('user')) return false;
        }
    }
)

export const accountSlice = createSlice({
    name:'account',
    initialState,
    reducers:{
        signOut: (state)=>{
            state.user = null;
            localStorage.removeItem('user');
            router.navigate("/");
        },
        setUser: (state,action)=>{
            //state.user = action.payload;
            let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            let roles = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            state.user = {...action.payload, roles: typeof(roles)==='string' ? [roles]: roles}
        }
    },
    extraReducers : (builder=>{
        builder.addCase(getCurrentUser.rejected, (state)=>{
            state.user = null;
            localStorage.removeItem('user');
            toast.error("Session expired - pleasa log in again");
            router.navigate("/");
        })
        builder.addMatcher(isAnyOf(signInUser.fulfilled,getCurrentUser.fulfilled),(state,action)=>{
            let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            let roles = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            state.user = {...action.payload, roles: typeof(roles)==='string' ? [roles]: roles}
        })
        builder.addMatcher(isAnyOf(signInUser.rejected, getCurrentUser.rejected), (state,action)=>{
            throw action.payload;
        })
    }) 
})

export const {signOut, setUser} = accountSlice.actions;