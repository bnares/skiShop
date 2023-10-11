import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";
import { VerticalAlignBottom } from "@mui/icons-material";

const sleep = ()=> new Promise(resolve=>setTimeout(resolve,500))


//axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.baseURL = "https://skishopapi.azurewebsites.net/api/";
axios.defaults.withCredentials = true; //to allow cleint server site to recive and use cookies
const responseBody = (response: AxiosResponse)=>response.data;

axios.interceptors.request.use(config=>{
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`; //to after refresh page get the token from app state so in order to work this we set state of the app in axios async func in accountSlice getCurrentUser 
    return config;
})

axios.interceptors.response.use( async response=>{
    await sleep();
    
    const pagination = response.headers['pagination'];
    if(pagination){
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination))
        return response;
    }
    return response;
}, (error: AxiosError)=>{
    const {data, status} = error.response! as AxiosResponse;
    switch(status){
        case 400:
            if(data.errors){ //in data.errors we have a dictionary => Problem1 : ["some error string"]. Problem1 is key. we put this to array of string modelStateErrors. we use this in Forms 
                const modelStateErrors: string[] = [];
                console.log("error");
                console.log(data);
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title); // add " || Unauthorized" after data.title  in case we dont have an error object just status code
            break;
        case 403:
            toast.error("You are not allowed to do that");
            break;
        case 500:
            router.navigate("/server-error",{state:{error:data}}); //navigate give us options to pass some data to redirected page, we send error data. to recive thus data in redirected page we use reacr hook called useLocation
            //toast.error(data.title);
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const request={
    get:(url:string, params?:URLSearchParams)=>axios.get(url,{params,headers:{
        'Access-Control-Allow-Credentials': true,
        'credentials':"include"
    }}).then(responseBody),
    post:(url:string,body: {})=>axios.post(url, body, {headers:{
        'Access-Control-Allow-Credentials': true,
        'credentials':"include"
    }}).then(responseBody),
    put:(url:string,body: {})=>axios.put(url, body,{headers:{
        'Access-Control-Allow-Credentials': true,
        'credentials':"include"
    }}).then(responseBody),
    delete:(url:string)=>axios.delete(url,{headers:{
        'Access-Control-Allow-Credentials': true,
        'credentials':"include"
    }}).then(responseBody),
    postForm: (url: string, data : FormData) => axios.post(url, data,{
        headers:{
            "Content-type":'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
            'credentials':"include"
    }
    }).then(responseBody),
    putForm: (url: string, data : FormData) => axios.put(url, data,{
        headers:{
            "Content-type":'multipart/form-data',
            'Access-Control-Allow-Credentials': true,
            'credentials':"include"
        }
    }).then(responseBody)
}

function createFormData(item: any){
    let formData = new FormData();
    for(const key in item){
        formData.append(key, item[key]);
    }
    return formData;
}

const Admin = {
    createProduct: (product: any)=> request.postForm('products', createFormData(product)),
    updateProduct: (product: any)=> request.putForm('products', createFormData(product)),
    deleteProduct: (id: number)=>request.delete(`products/${id}`)
}

const Catalog = {
    list: (params:URLSearchParams)=> request.get("products",params),
    details: (id: number)=>request.get(`products/${id}`),
    fetchFilters:()=>request.get("Products/filters"),
}

const TestErrors = {
    get400Error : ()=> request.get("buggy/bad-request"),
    get401Error : ()=> request.get("buggy/unauthorized"),
    get404Error : ()=> request.get("buggy/not-found"),
    getValidationError : ()=> request.get("buggy/validation-error"),
    get500Error : ()=> request.get("buggy/server-error"),
}

const Basket = {
    get: ()=> request.get("basket"),
    addItem: (productId : number, quantity =1)=> request.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    deleteItem: (productId : number, quantity =1)=> request.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const Account={
    login:(values:any)=>request.post("account/login",values),
    register:(values:any)=>request.post("account/register",values),
    currentUser:()=>request.get("account/currentUser"),
    fetchAddress: ()=>request.get("account/savedAddress"),
}

const Orders = {
    list: ()=>request.get("orders"),
    fetch: (id:number)=>request.get(`orders/${id}`),
    create : (value:{})=>request.post('orders', value),
}

const Payments = {
    createPaymentIntent: () => request.post("payment",{})
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payments,
    Admin
}

export default agent;