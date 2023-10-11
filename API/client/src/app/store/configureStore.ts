import { createStore } from "redux";
//import counterReducer from "../../features/contact/counterReducrer";
import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { accountSlice } from "../../features/account/accountSlice";
import { orderSlice } from "../../features/orders/orderSlice";

// export function configureStore(){
//     return createStore(counterReducer)
// }

export const store = configureStore({
    reducer:{
        counter: counterSlice.reducer,
        basket : basketSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer, //adding slice 
        order: orderSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = ()=> useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;