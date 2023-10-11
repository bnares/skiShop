import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Order } from "../../app/models/order";
import agent from "../../app/api/agent";

interface OrderState {
    item: Order | null,
    ordersList: Order[] | null,
    status: string,
}

const initialState : OrderState = {
    item: null,
    ordersList: null,
    status:'idle'
}

export const fetchOrders = createAsyncThunk<Order[]>(
    "orders/fetchOrders",
    async (_, thunkAPI) =>{
        try{
            return await agent.Orders.list()
        }catch(error: any){
            thunkAPI.rejectWithValue({error:error.data})
        }
    }
)

export const orderSlice = createSlice({
    name: "order",
    initialState:initialState,
    reducers:{
        setItem: (state, action)=>{
            console.log("redux SetItem");
            console.log(action.payload);
            state.item = action.payload
        },
        clearItem:(state, action)=>{
            state.item = null
        },
        setOrdersList:(state, action)=>{
            state.ordersList = action.payload
        },
        clearOrdersList:(state, action)=>{
            state.ordersList = null
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchOrders.pending, (state, action)=>{
            state.status = "action"
        });
        builder.addCase(fetchOrders.fulfilled, (state, action)=>{
            state.ordersList = action.payload;
            state.status = "idle";
        });
        builder.addCase(fetchOrders.rejected, (state, action)=>{
            state.status="idle"
        })
    }
})

export const {setItem, clearItem, setOrdersList, clearOrdersList} = orderSlice.actions;